import { AlertReceiverTable } from '@/components/receivers/AlertReceiversTable';

export default function AlertReceiversPage() {
  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h1 className='text-2xl font-bold'>Alert Receivers</h1>
        <p className='text-sm text-muted-foreground'>
          Manage users who receive StarPay alerts.
        </p>
      </div>

      <AlertReceiverTable />
    </div>
  );
}
