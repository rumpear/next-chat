import { ZodError, z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { fetchRedis } from '@/lib/redis';
import { emailSchema } from '@/lib/schemes';

type TBody = z.infer<typeof emailSchema>;
type TIsMember = 0 | 1;

export async function POST(req: Request) {
  try {
    const body: TBody = await req.json();

    const { email: emailToAdd } = emailSchema.parse(body);

    const idToAdd = await fetchRedis<string>('get', `user:email:${emailToAdd}`);
    console.log(idToAdd, 'idToAdd');

    if (!idToAdd) {
      return new Response('This person does not exist', { status: 400 });
    }

    const session = await getServerSession(authOptions);
    console.log(session, 'session');
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response('You cannot add yourself as another user', {
        status: 400,
      });
    }

    const isAlreadyAdded = await fetchRedis<TIsMember>(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    );

    console.log(isAlreadyAdded, 'isAlreadyAdded');

    if (isAlreadyAdded) {
      return new Response('This user already added', { status: 409 });
    }

    const isAlreadyFriends = await fetchRedis<TIsMember>(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    );

    console.log(isAlreadyFriends, 'isAlreadyAdded');

    if (isAlreadyFriends) {
      return new Response('This user already your friend', { status: 409 });
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response('Friend added successfully', { status: 200 });
  } catch (e) {
    console.log(e, 'error');
    if (e instanceof ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
