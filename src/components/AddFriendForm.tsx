'use client';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodError, z } from 'zod';
import { emailSchema } from '@/lib/schemes';
import Button from '@/components/ui/Button';

interface IAddFormData {
  email: z.infer<typeof emailSchema>;
}

type TAddFriendFormData = z.infer<typeof emailSchema>;

const AddFriendForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IAddFormData['email']>({
    resolver: zodResolver(emailSchema),
  });

  const addFriend = async (email: string) => {
    console.log('adding');
    try {
      setIsLoading(true);
      const validatedEmail = emailSchema.parse({ email });
      await axios.post('/api/friends/add', validatedEmail);
    } catch (error) {
      if (error instanceof ZodError) {
        setError('email', { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        console.log(error.message, 'error.message');
        console.log(error.response?.data, 'error.response?.data');
        setError('email', { message: error.response?.data });
        return;
      }

      setError('email', { message: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (data: IAddFormData['email']) => {
    console.log('click');
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='max-w-sm'>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        Add friend by email
      </label>

      <div className='mt-2 flex gap-4'>
        <input
          {...register('email')}
          type='text'
          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='you@example.com'
        />
        <Button isLoading={isLoading}>Add</Button>
      </div>
      <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
      {!errors.email && !isLoading && (
        <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriendForm;
