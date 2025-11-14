"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

import { createAccountSchema } from "@/lib/validators/account";
import { useCreateAccount } from "@/hooks/useAccounts";
import { CreateAccountPayload } from "@/types/account";
import { getErrorMessage } from "@/lib/error";

type FormValues = CreateAccountPayload;

export function AddAccountDialog() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "admin",
    },
  });

  const { mutateAsync: createAccount, isPending } = useCreateAccount();

  const onSubmit = async (values: FormValues) => {
    try {
      await createAccount(values);
      toast.success("Account created successfully");

      form.reset({
        username: "",
        password: "",
        role: "admin",
      });
      setOpen(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-600/80 cursor-pointer"
        >
          Add Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add account
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...form.register("username")}
              disabled={isPending}
              placeholder="admin"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              disabled={isPending}
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              {...form.register("role")}
              disabled={isPending}
              placeholder="admin / super_admin"
            />
            {form.formState.errors.role && (
              <p className="text-sm text-destructive">
                {form.formState.errors.role.message}
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
              className="bg-green-600 hover:bg-green-600/80 cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
