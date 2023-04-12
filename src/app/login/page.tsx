'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

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
    <>
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex flex-col items-center max-w-md space-y-8'>
          <div className='flex flex-col items-center gap-8'>
            Logo
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              Sign in to your account
            </h2>
            <Button
              isLoading={isLoading}
              onClick={handleGoogleLogin}
              className='w-full max-w-sm mx-auto'
            >
              Google
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
