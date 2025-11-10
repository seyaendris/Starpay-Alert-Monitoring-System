'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCcw } from 'lucide-react';
import { AlertHistoryItem } from '@/types/alert';

type PaginatedAlertHistory = {
  data: AlertHistoryItem[];
  page: number;
  limit: number;
  total: number;
};

// ---------- Helpers ----------
function toDateString(epochLike: string | number | null | undefined) {
  if (!epochLike) return '-';
  const n = Number(epochLike);
  if (!Number.isFinite(n)) return '-';
  const d = new Date(n);
  // If your API returns seconds instead of ms, uncomment next line
  // if (d.getFullYear() < 2005) return new Date(n * 1000).toLocaleString();
  return d.toLocaleString();
}

function truncate(text: string, max = 80) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function TypeBadge({ type }: { type: string }) {
  const normalized = type?.toLowerCase();
  const cls =
    normalized === 'escalated'
      ? 'bg-red-100 text-red-700 border-red-300'
      : normalized === 'escalate'
      ? 'bg-amber-100 text-amber-700 border-amber-300'
      : 'bg-emerald-100 text-emerald-700 border-emerald-300';
  return (
    <Badge variant='outline' className={cn('capitalize', cls)} title={type}>
      {type || '—'}
    </Badge>
  );
}

function SentBadge({ sent }: { sent: boolean }) {
  return (
    <Badge
      variant='outline'
      className={cn(
        'capitalize',
        sent
          ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
          : 'bg-gray-100 text-gray-700 border-gray-300'
      )}
    >
      {sent ? 'sent' : 'pending'}
    </Badge>
  );
}

const DEFAULT_LIMIT = 20;

// ---------- Data hook ----------
function useAlertHistory(page: number, limit: number) {
  return useQuery({
    queryKey: ['alert-history', page, limit],
    queryFn: async () => {
      const res = await api.get<PaginatedAlertHistory>(
        '/api/v1/starpay-alert/alert/paginated',
        { params: { page, limit } }
      );
      return res.data;
    },
  });
}

// ---------- Component ----------
export function AlertTable({
  initialPage = 1,
  initialLimit = DEFAULT_LIMIT,
  className,
}: {
  initialPage?: number;
  initialLimit?: number;
  className?: string;
}) {
  const [page, setPage] = React.useState(initialPage);
  const [limit, setLimit] = React.useState(initialLimit);

  const { data, isFetching, isLoading, isError, refetch } = useAlertHistory(
    page,
    limit
  );

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  // clamp page when total changes
  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Header / Controls */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold'>Alert History</h2>
          <p className='text-sm text-muted-foreground'>
            All alerts, newest first.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <select
            className='h-9 rounded-md border px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600'
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            aria-label='Rows per page'
          >
            {[10, 20, 30, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>

          <Button
            variant='outline'
            onClick={() => refetch()}
            className='border-green-600 text-green-700 hover:bg-green-50'
            disabled={isFetching}
          >
            <RefreshCcw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto rounded-lg border'>
        <Table>
          <TableHeader className='bg-green-600/5'>
            <TableRow>
              <TableHead className='min-w-[120px]'>Name</TableHead>
              <TableHead className='min-w-[260px]'>Message</TableHead>
              <TableHead className='min-w-[110px]'>Type</TableHead>
              <TableHead className='min-w-[110px]'>Sent</TableHead>
              <TableHead className='min-w-[110px]'>Level</TableHead>
              <TableHead className='min-w-[180px]'>Receiver</TableHead>
              <TableHead className='min-w-[170px]'>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={7}>
                    <div className='h-6 w-full animate-pulse rounded bg-gray-100' />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-sm text-destructive'>
                      Failed to load alert history.
                    </p>
                    <Button
                      variant='outline'
                      className='border-green-600 text-green-700 hover:bg-green-50'
                      onClick={() => refetch()}
                    >
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (data?.data?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <p className='text-sm text-muted-foreground'>
                    No alerts found.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              data!.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>
                    {truncate(item.alert_name, 40)}
                  </TableCell>

                  <TableCell className='text-muted-foreground'>
                    {truncate(item.alert_message, 90)}
                  </TableCell>

                  <TableCell>
                    <TypeBadge type={item.alert_type} />
                  </TableCell>

                  <TableCell>
                    <SentBadge sent={item.is_sent} />
                  </TableCell>

                  <TableCell>{item.notification_level_used}</TableCell>

                  <TableCell>
                    {item.alert_receivers_email ??
                      item.alert_receivers_phone_number ??
                      '—'}
                  </TableCell>

                  <TableCell>{toDateString(item.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Page <span className='font-medium'>{data?.page ?? page}</span> of{' '}
          <span className='font-medium'>{pageCount}</span> •{' '}
          <span className='font-medium'>{total}</span> total
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-label='Previous'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  'cursor-pointer',
                  page <= 1 && 'pointer-events-none opacity-50'
                )}
              />
            </PaginationItem>

            {/* Simple windowed page links */}
            {Array.from({ length: pageCount })
              .slice(Math.max(0, page - 3), Math.min(pageCount, page + 2))
              .map((_, idx) => {
                const current = Math.max(1, page - 2) + idx;
                return (
                  <PaginationItem key={current}>
                    <PaginationLink
                      onClick={() => setPage(current)}
                      isActive={current === page}
                      className={cn(
                        'cursor-pointer',
                        current === page &&
                          'bg-green-600 text-white hover:bg-green-700'
                      )}
                    >
                      {current}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            {page + 2 < pageCount && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                aria-label='Next'
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className={cn(
                  'cursor-pointer',
                  page >= pageCount && 'pointer-events-none opacity-50'
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Loading overlay */}
      {isFetching && !isLoading && (
        <div className='pointer-events-none fixed inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-green-600 text-white px-3 py-1.5 text-xs shadow'>
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-3.5 w-3.5 animate-spin' />
            Updating…
          </span>
        </div>
      )}
    </div>
  );
}
