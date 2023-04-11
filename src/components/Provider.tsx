'use client';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface IProviderProps {
  children: ReactNode;
}

const Provider = ({ children }: IProviderProps) => {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      {children}
    </>
  );
};

export default Provider;
