'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icons from '@/components/ui/Icons';
import { ROUTES } from '@/constants/routes';

interface ISidebarFriendRequestsProps {
  sessionId: string;
  initUnseenReqCount: number;
}

const SidebarFriendRequests = ({
  sessionId,
  initUnseenReqCount,
}: ISidebarFriendRequestsProps) => {
  const [unseenReqCount, setUnseenReqCount] =
    useState<number>(initUnseenReqCount);

  return (
    <Link
      href={ROUTES.dashboard.requests}
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
      <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <Icons.User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend requests</p>

      {!!unseenReqCount && (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
          {unseenReqCount}
        </div>
      )}
    </Link>
  );
};

export default SidebarFriendRequests;
