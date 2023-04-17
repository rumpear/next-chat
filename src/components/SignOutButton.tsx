'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icons';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

const SignOutButton = () => {
  const [isSigninOut, setIsSigninOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      setIsSigninOut(true);
      await signOut();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while signing out');
    } finally {
      setIsSigninOut(false);
    }
  };

  return (
    <Button
      type='button'
      onClick={handleSignOut}
      isLoading={isSigninOut}
      className='h-full aspect-square'
    >
      <Icons.LogOut className='w-4 h-4' />
    </Button>
  );
};

export default SignOutButton;
