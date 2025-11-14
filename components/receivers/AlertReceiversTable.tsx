'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import {
  useAlertReceivers,
  useDeleteAlertReceiver,
} from '@/hooks/useAlertReceivers';
import { AddReceiverDialog } from './AddReceiverDialog';
import { UpdateReceiverDialog } from './UpdateReceiverDialog';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { formatMsTimestampString } from '@/lib/data';
import { getErrorMessage } from '@/lib/error';
import { TablePagination } from '../shared/Pagination';
import { Loader } from '../shared/Loader';

const PAGE_LIMIT = 10;

export function AlertReceiverTable() {
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError, error, isFetching } = useAlertReceivers({
    page,
    limit: PAGE_LIMIT,
  });

  const { mutateAsync: deleteReceiver, isPending: isDeleting } =
    useDeleteAlertReceiver();

  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;

  const handleDelete = async (id: string) => {
    try {
      await deleteReceiver(id);
      toast.success('Receiver deleted successfully');
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      toast.error(msg);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end'>
        <AddReceiverDialog />
      </div>

      <div className='rounded-md border'>
        {isLoading ? (
          <div className='flex items-center justify-center py-10'>
            <Loader label='Loading receivers...' size='md' />
          </div>
        ) : isError ? (
          <div className='p-4 text-sm text-destructive'>
            {getErrorMessage(error) || 'Failed to load receivers'}
          </div>
        ) : (
          <>
            <div className='overflow-x-auto max-w-screen rounded-md'>
              <Table>
                <TableHeader className='bg-green-500'>
                  <TableRow>
                    <TableHead className='text-white'>Email</TableHead>
                    <TableHead className='text-white'>Phone number</TableHead>
                    <TableHead className='text-white'>Level</TableHead>
                    <TableHead className='text-white'>Created at</TableHead>
                    <TableHead className='text-white'>Updated at</TableHead>
                    <TableHead className='w-[120px] text-right text-white'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='bg-neutral-100/60'>
                  {data?.data?.length ? (
                    data.data.map((receiver) => (
                      <TableRow key={receiver.id}>
                        <TableCell>{receiver.email}</TableCell>
                        <TableCell>{receiver.phone_number}</TableCell>
                        <TableCell>{receiver.level}</TableCell>
                        <TableCell>
                          {formatMsTimestampString(receiver.created_at)}
                        </TableCell>
                        <TableCell>
                          {formatMsTimestampString(receiver.updated_at)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <UpdateReceiverDialog receiver={receiver} />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  disabled={isDeleting}
                                  className='bg-red-50 hover:bg-red-100 rounded-full cursor-pointer'
                                >
                                  <Trash2 className='h-4 w-4 text-red-600' />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete receiver?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    remove{' '}
                                    <span className='font-semibold'>
                                      {receiver.email}
                                    </span>{' '}
                                    from alert receivers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(receiver.id)}
                                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
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
                      <TableCell colSpan={6} className='text-center py-8'>
                        <p className='text-sm text-muted-foreground'>
                          No receivers found.
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
      {total > PAGE_LIMIT && (
        <div className='px-4 py-3'>
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
