"use client";

import * as React from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import {
  useAccounts,
  useDeleteAccount,
} from "@/hooks/useAccounts";
import { AddAccountDialog } from "./AddAccountDialog";
import { UpdateAccountDialog } from "./UpdateAccountDialog";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "@/components/shared/Loader";
import { TablePagination } from "@/components/shared/Pagination";
import { getErrorMessage } from "@/lib/error";

const PAGE_LIMIT = 10;

export function AccountsTable() {
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError, error, isFetching } = useAccounts({
    page,
    limit: PAGE_LIMIT,
  });

  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteAccount();

  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;

  const handleDelete = async (id: string, username: string) => {
    try {
      await deleteAccount(id);
      toast.success(`Account "${username}" deleted successfully`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <AddAccountDialog />
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader label="Loading accounts..." size="md" />
          </div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">
            {getErrorMessage(error) || "Failed to load accounts"}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto max-w-screen rounded-md">
              <Table>
                <TableHeader className="bg-green-500">
                  <TableRow>
                    <TableHead className="text-white">Username</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="w-[120px] text-right text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-neutral-100/60">
                  {data?.data?.length ? (
                    data.data.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.username}</TableCell>
                        <TableCell>{account.role}</TableCell>
                        <TableCell>
                          <span
                            className={
                              account.is_active
                                ? "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                                : "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                            }
                          >
                            {account.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <UpdateAccountDialog account={account} />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isDeleting}
                                  className="bg-red-50 hover:bg-red-100 rounded-full cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete account?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    delete the account{" "}
                                    <span className="font-semibold">
                                      {account.username}
                                    </span>
                                    .
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(account.id, account.username)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          No accounts found.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {total > 0 && (
        <div className="px-4 py-3">
          <TablePagination
            page={currentPage}
            pageSize={PAGE_LIMIT}
            total={total}
            isLoading={isFetching}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
