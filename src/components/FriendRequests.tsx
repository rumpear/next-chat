'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Check, UserPlus, X } from 'lucide-react';
import { GOOGLE_AVATAR_SIZES } from '@/constants/common';
import { IUser } from '@/interfaces/global';

interface IFriendRequestsProps {
  incomingRequests: IIncomingRequest[];
  sessionId: string;
}

interface IIncomingRequest {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

const FriendRequests = ({
  sessionId,
  incomingRequests,
}: IFriendRequestsProps) => {
  const [friendRequests, setFriendsRequests] =
    useState<IIncomingRequest[]>(incomingRequests);

  const addFriend = async (id: string) => {
    console.log('click');
    try {
      await axios.post('/api/friends/accept', {
        id,
      });
    } catch (error) {
      console.log(error, 'new error');
    }
  };

  const denyFriend = async (id: string) => {
    try {
      await axios.post('/api/friends/deny', { id });
    } catch (error) {
      console.log(error, 'new error');
    }
  };

  const isFriendRequestsExist = friendRequests.length;
  // console.log(friendRequests, 'friendRequests')
  return (
    <>
      {isFriendRequestsExist &&
        friendRequests.map((friend) => (
          <div key={friend.id} className='flex gap-4 items-center'>
            <div className='h-10 w-10'>
              <Image
                referrerPolicy='no-referrer'
                className='rounded-full'
                src={friend.image || ''}
                width={GOOGLE_AVATAR_SIZES}
                height={GOOGLE_AVATAR_SIZES}
                alt={friend.name || 'friend to add'}
              />
            </div>
            <p className='font-medium text-lg'>{friend.name}</p>

            <button
              onClick={() => addFriend(friend.id!)}
              aria-label='accept friend'
              className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
            >
              <Check className='font-semibold text-white w-3/4 h-3/4' />
            </button>

            <button
              onClick={() => denyFriend(friend.id!)}
              aria-label='deny friend'
              className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
            >
              <X className='font-semibold text-white w-3/4 h-3/4' />
            </button>
          </div>
        ))}
      {!isFriendRequestsExist && (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      )}
    </>
  );
};

export default FriendRequests;
