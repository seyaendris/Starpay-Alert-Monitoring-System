'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

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

import { createAlertReceiverSchema } from '@/lib/validators/alertReceiver';
import { useCreateAlertReceiver } from '@/hooks/useAlertReceivers';
import { AlertReceiverPayload } from '@/types/alertReceiver';
import { getErrorMessage } from '@/lib/error';

type FormValues = AlertReceiverPayload;

export function AddReceiverDialog() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createAlertReceiverSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      level: 1,
    },
  });

  const { mutateAsync: createReceiver, isPending } = useCreateAlertReceiver();

  const onSubmit = async (values: FormValues) => {
    try {
      await createReceiver(values);
      toast.success('Receiver created successfully');

      form.reset({
        email: '',
        phone_number: '',
        level: 1,
      });
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
          size='sm'
          className='bg-green-600 hover:bg-green-600/80 cursor-pointer'
        >
          Add Receiver
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Add alert receiver
          </DialogTitle>
        </DialogHeader>

        <form
          className='space-y-4'
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...form.register('email')}
              disabled={isPending}
              placeholder='john@example.com'
            />
            {form.formState.errors.email && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone_number'>Phone number</Label>
            <Input
              id='phone_number'
              {...form.register('phone_number')}
              disabled={isPending}
              placeholder='+251 555 555 5555'
            />
            {form.formState.errors.phone_number && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.phone_number.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='level'>Level</Label>
            <Input
              id='level'
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
              className='bg-green-600 hover:bg-green-600/80 cursor-pointer'
              type='submit'
              disabled={isPending}
            >
              {isPending ? 'Adding...' : 'Add Receiver'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
