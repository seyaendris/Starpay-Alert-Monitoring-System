'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateAlertReceiverSchema } from '@/lib/validators/alertReceiver';
import { useUpdateAlertReceiver } from '@/hooks/useAlertReceivers';
import { AlertReceiver, AlertReceiverPayload } from '@/types/alertReceiver';
import { getErrorMessage } from '@/lib/error';

type FormValues = AlertReceiverPayload;

interface UpdateReceiverDialogProps {
  receiver: AlertReceiver;
}

export function UpdateReceiverDialog({ receiver }: UpdateReceiverDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateAlertReceiverSchema),
    defaultValues: {
      email: receiver.email,
      phone_number: receiver.phone_number,
      level: receiver.level,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        email: receiver.email,
        phone_number: receiver.phone_number,
        level: receiver.level,
      });
    }
  }, [open, receiver, form]);

  const { mutateAsync: updateReceiver, isPending } = useUpdateAlertReceiver();

  const onSubmit = async (values: FormValues) => {
    try {
      await updateReceiver({ id: receiver.id, payload: values });
      toast.success('Receiver updated successfully');
      setOpen(false);
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='bg-green-50 rounded-full p-4 hover:bg-green-100 cursor-pointer'
        >
          <Pencil className='h-6 w-6 text-green-800' />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Update alert receiver
          </DialogTitle>
        </DialogHeader>

        <form
          className='space-y-4'
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className='space-y-2'>
            <Label htmlFor={`email-${receiver.id}`}>Email</Label>
            <Input
              id={`email-${receiver.id}`}
              type='email'
              {...form.register('email')}
              disabled={isPending}
            />
            {form.formState.errors.email && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`phone-${receiver.id}`}>Phone number</Label>
            <Input
              id={`phone-${receiver.id}`}
              {...form.register('phone_number')}
              disabled={isPending}
            />
            {form.formState.errors.phone_number && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.phone_number.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`level-${receiver.id}`}>Level</Label>
            <Input
              id={`level-${receiver.id}`}
              type='number'
              {...form.register('level', { valueAsNumber: true })}
              disabled={isPending}
            />
            {form.formState.errors.level && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.level.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isPending}
              className='cursor-pointer bg-neutral-100 hover:bg-neutral-100/50'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='cursor-pointer bg-green-600 hover:bg-green-600/80'
            >
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
