import { LoginForm } from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='bg-white relative hidden lg:flex flex-col items-center justify-center px-10 pb-28'>
        <Image
          src='/images/starpay.png'
          alt='Image'
          width={500}
          height={300}
          className='object-contain dark:brightness-[0.2] dark:grayscale px-5 pb-28'
        />
        <h1 className='text-3xl font-bold text-blue-950 pl-17'>
          Alert Monitoring System
        </h1>
      </div>

      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
