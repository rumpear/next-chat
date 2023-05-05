import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import SignOutButton from '@/components/SignOutButton';
import SidebarFriendRequests from '@/components/SidebarFriendRequests';
import Icons, { TIcon } from '@/components/ui/Icons';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/lib/redis';
import { GOOGLE_AVATAR_SIZES } from '@/constants/common';
import { IUser, TFriendRequests } from '@/interfaces/global';

interface IDashboardLayoutProps {
  children: ReactNode;
}

interface ISidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: TIcon;
}

const sidebarOptions: ISidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
];

const getFriendsByUserId = async (userId: string) => {
  const friendIds = await fetchRedis<string[]>(
    'smembers',
    `user:${userId}:friends`
  );
  console.log(friendIds, 'friendIds-----');

  const promisedFriendsList = friendIds.map(async (id) => {
    return await fetchRedis<string>('get', `user:${id}`);
  });

  const friendList = await Promise.all(promisedFriendsList);

  const parsedFriendList = friendList.map((friend) => {
    try {
      const parsedFriend: IUser = JSON.parse(friend);
      return parsedFriend;
    } catch (e) {
      console.log(e);
    }
  });
  console.log(parsedFriendList, 'parsedFriendList');
  return parsedFriendList;
};

export default async function DashboardLayout({
  children,
}: IDashboardLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const friendsList = await getFriendsByUserId(session.user.id);
  const isFriendsListExist = !!friendsList.length;
  console.log(friendsList, 'friendList');

  const friendRequests = await fetchRedis<TFriendRequests>(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  );

  const unseenReqCount = friendRequests.length;
  // console.log(unseenReqCount, 'unseenReqCount');

  return (
    <div className='w-full flex h-screen'>
      {/*<div className='md:hidden'>*/}
      {/*  <MobileChatLayout*/}
      {/*      friends={friends}*/}
      {/*      session={session}*/}
      {/*      sidebarOptions={sidebarOptions}*/}
      {/*      unseenRequestCount={unseenRequestCount}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
          <span className='text-gray-900 text-3xl mr-4'>Chatters</span>
          <Icons.Logo className='h-8 w-auto text-indigo-600' />
        </Link>

        <div className='text-xs font-semibold leading-6 text-gray-400'>
          {isFriendsListExist ? 'Your chats' : 'You dont have any chats'}
        </div>

        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>
              {isFriendsListExist &&
                friendsList.map((friend) => {
                  return (
                    <p className='text-2xl text-black' key={friend?.id}>
                      {friend?.name}
                    </p>
                  );
                })}
              {/*<SidebarChatList sessionId={session.user.id} friends={friends} />*/}
            </li>
            <li>
              <div className='text-xs font-semibold leading-6 text-gray-400'>
                Overview
              </div>

              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      >
                        <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                          <Icon className='h-4 w-4' />
                        </span>

                        <span className='truncate'>{option.name}</span>
                      </Link>
                    </li>
                  );
                })}

                <li>
                  <SidebarFriendRequests
                    sessionId={session.user.id}
                    initUnseenReqCount={unseenReqCount}
                  />
                </li>
              </ul>
            </li>

            <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50'>
                  <Image
                    width={GOOGLE_AVATAR_SIZES}
                    height={GOOGLE_AVATAR_SIZES}
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ''}
                    alt={session.user.name || ''}
                  />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton />
            </li>
          </ul>
        </nav>
      </div>

      <aside className='max-h-screen container p-12 py-16 md:py-12 w-full'>
        {children}
      </aside>
    </div>
  );
}
