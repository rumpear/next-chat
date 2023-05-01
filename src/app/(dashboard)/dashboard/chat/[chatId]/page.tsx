import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/lib/redis';
import { IMessage, IUser } from '@/interfaces/global';

interface ICurrentChatPageProps {
  params: {
    chatId: string;
  };
}

const FIRST_IDX = 0;
const LAST_IDX = -1;

const getMessages = async (chatId: string) => {
  try {
    const res: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      FIRST_IDX,
      LAST_IDX
    );
    const messages: IMessage[] = res.map((message) => JSON.parse(message));
    return messages;
  } catch (error) {
    notFound();
  }
};

export default async function CurrentChatPage({
  params,
}: ICurrentChatPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const [userId1, userId2] = params.chatId.split('--');

  if (userId1 !== session.user.id && userId2 !== session.user.id) {
    return notFound();
  }

  const partnerId = session.user.id === userId1 ? userId2 : userId1;
  const partner: IUser | null = await db.get(`user:${partnerId}`);
  const messages = await getMessages(partnerId);

  return (
    <>
      <pre>{params.chatId}</pre>
    </>
  );
}
