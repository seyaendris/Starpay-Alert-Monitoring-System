"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateAccountSchema } from "@/lib/validators/account";
import { useUpdateAccount } from "@/hooks/useAccounts";
import { Account, UpdateAccountPayload } from "@/types/account";
import { getErrorMessage } from "@/lib/error";

type FormValues = UpdateAccountPayload;

interface UpdateAccountDialogProps {
  account: Account;
}

export function UpdateAccountDialog({ account }: UpdateAccountDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      username: account.username,
      role: account.role,
      is_active: account.is_active,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        username: account.username,
        role: account.role,
        is_active: account.is_active,
      });
    }
  }, [open, account, form]);

  const { mutateAsync: updateAccount, isPending } = useUpdateAccount();

  const onSubmit = async (values: FormValues) => {
    try {
      await updateAccount({ id: account.id, payload: values });
      toast.success("Account updated successfully");
      setOpen(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-green-50 rounded-full p-4 hover:bg-green-100 cursor-pointer"
        >
          <Pencil className="h-6 w-6 text-green-800" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Update account
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor={`username-${account.id}`}>Username</Label>
            <Input
              id={`username-${account.id}`}
              {...form.register("username")}
              disabled={isPending}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`role-${account.id}`}>Role</Label>
            <Input
              id={`role-${account.id}`}
              {...form.register("role")}
              disabled={isPending}
            />
            {form.formState.errors.role && (
              <p className="text-sm text-destructive">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`is_active-${account.id}`}>Active</Label>
            <div className="flex items-center gap-2">
              <input
                id={`is_active-${account.id}`}
                type="checkbox"
                className="h-4 w-4"
                {...form.register("is_active")}
                disabled={isPending}
              />
              <span className="text-sm text-muted-foreground">
                Account is active
              </span>
            </div>
            {form.formState.errors.is_active && (
              <p className="text-sm text-destructive">
                {form.formState.errors.is_active.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="cursor-pointer bg-neutral-100 hover:bg-neutral-100/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer bg-green-600 hover:bg-green-600/80"
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
