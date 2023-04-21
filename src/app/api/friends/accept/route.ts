import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/lib/redis';

export async function POST(req: Request) {
  console.log('POST');
  console.log(req, 'req');
  try {
    console.log('something happened');
    const body = await req.json();
    console.log(body, 'body');
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const isFriend = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isFriend) {
      return new Response('Is already friends', { status: 400 });
    }

    const isFriendRequestExist = await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!isFriendRequestExist) {
      return new Response('Friend request is not exist', { status: 400 });
    }

    return new Response('Ok', { status: 200 });
  } catch (error) {
    console.log(error, 'error');
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
