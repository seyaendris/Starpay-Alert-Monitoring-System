'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { forwardRef } from 'react';
import { motion, Variants } from 'framer-motion';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { LoginFormSchema, LoginFormValues } from '@/lib/validators/authSchema';
import { isAxiosError } from 'axios';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, ease: 'easeOut', duration: 0.6 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } },
};

// lightweight JWT payload decode (no verification)
function decodeJwtPayload<T = Record<string, unknown>>(
  token?: string
): T | null {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

type LoginResponse = {
  status: number;
  message: string;
  data: {
    access_token: string;
    role?: string;
    roles?: string[];
    username?: string;
  };
};

export type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const LoginForm = forwardRef<HTMLFormElement, React.ComponentProps<'form'>>(
  ({ className, ...props }, ref) => {
    const router = useRouter();
    const { login } = useAuthStore();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormValues>({
      resolver: zodResolver(LoginFormSchema),
      mode: 'onSubmit',
    });

    const mutation = useMutation({
      mutationFn: (values: LoginFormValues) =>
        api.post<LoginResponse>('/api/v1/starpay-alert/login', values),

      onSuccess: (res, variables) => {
        const payload = res.data?.data;
        const token = payload?.access_token;

        const role = payload?.role ?? payload?.roles?.[0] ?? null;

        let username = payload?.username ?? null;
        if (!username && token) {
          const decoded = decodeJwtPayload<{ username?: string }>(token);
          username = decoded?.username ?? null;
        }
        if (!username) username = variables.username;

        if (!token) {
          toast.error('Missing access token in response');
          return;
        }

        login(token, role, username);

        toast.success(`Welcome back${username ? `, ${username}` : ''}!`);
        router.replace('/');
      },

      onError: (error: unknown) => {
        const fallback = 'Something went wrong';

        if (isAxiosError<ApiErrorBody>(error)) {
          const msg =
            error.response?.data?.message ?? error.message ?? fallback;
          toast.error(msg);
          return;
        }

        toast.error(fallback);
      },
    });

    const onSubmit = (data: LoginFormValues) => {
      mutation.mutate(data);
    };

    const pending = mutation.isPending;

    return (
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='w-full'
      >
        <form
          ref={ref}
          className={cn('flex flex-col gap-6', className)}
          onSubmit={handleSubmit(onSubmit)}
          {...props}
          noValidate
        >
          <FieldGroup>
            <div className='flex flex-col items-center gap-1 text-center'>
              <motion.h1
                variants={childVariants}
                className='text-2xl font-bold'
              >
                Login to your account
              </motion.h1>
              <motion.p
                variants={childVariants}
                className='text-muted-foreground text-sm'
              >
                Enter your username and password to login
              </motion.p>
            </div>

            <motion.div variants={childVariants}>
              <Field>
                <FieldLabel htmlFor='username'>Username</FieldLabel>
                <Input
                  id='username'
                  type='text'
                  autoComplete='username'
                  disabled={pending}
                  aria-invalid={!!errors.username}
                  {...register('username')}
                />
                {errors.username?.message && (
                  <p className='mt-1 text-sm text-destructive'>
                    {String(errors.username.message)}
                  </p>
                )}
              </Field>
            </motion.div>

            <motion.div variants={childVariants}>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Link
                    href='/forgot-password'
                    className='ml-auto text-sm underline-offset-4 hover:underline text-brand-500'
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  disabled={pending}
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {errors.password?.message && (
                  <p className='mt-1 text-sm text-destructive'>
                    {String(errors.password.message)}
                  </p>
                )}
              </Field>
            </motion.div>

            <motion.div variants={childVariants}>
              <Button
                className='w-full bg-green-600 hover:bg-green-600/70 text-white font-medium cursor-pointer'
                type='submit'
                disabled={pending}
              >
                {pending ? 'Logging in...' : 'Login'}
              </Button>
            </motion.div>

            <motion.div variants={childVariants}>
              <FieldDescription className='text-center'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/sign-up'
                  className='underline underline-offset-4 text-brand-500'
                >
                  Sign up
                </Link>
              </FieldDescription>
            </motion.div>
          </FieldGroup>
        </form>
      </motion.div>
    );
  }
);

LoginForm.displayName = 'LoginForm';
export { LoginForm };
