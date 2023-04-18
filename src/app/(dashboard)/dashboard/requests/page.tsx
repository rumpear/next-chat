import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/lib/redis';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import FriendRequests from '@/components/FriendRequests';
import { IUser, TFriendRequests } from '@/interfaces/global';

export default async function FriendRequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const senderIdList = await fetchRedis<TFriendRequests>(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  );

  const senderList = await Promise.all(
    senderIdList.map(async (id) => {
      try {
        const senderRes = await fetchRedis<string>('get', `user:${id}`);
        const senderParsed: IUser = JSON.parse(senderRes);
        return {
          id: senderParsed.id,
          name: senderParsed.name,
          email: senderParsed.email,
          image: senderParsed.image,
        };
      } catch (error) {
        console.log('Something went wrong while parsing sender', error);
        return null;
      }
    })
  );
  const filteredSenderList: IUser[] = senderList.filter(
    (sender) => sender
  ) as IUser[];
  console.log(filteredSenderList);

  // console.log(senderIdList, 'senderIdList');
  console.log(senderList, 'senderList');
  // console.log(typeof senderList, 'senderList');
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingRequests={filteredSenderList}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
}
