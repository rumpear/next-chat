'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icons';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.log(error, 'error');
      toast.error('Something went wrong while login');
    }

    setIsLoading(false);
  };

  return (
    <main className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full flex flex-col items-center max-w-md space-y-8'>
        <div className='flex flex-col items-center gap-8'>
          <Icons.Logo />
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
          <Button
            isLoading={isLoading}
            onClick={handleGoogleLogin}
            className='w-full max-w-sm mx-auto'
          >
            <Icons.GoogleLogo /> Google
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
