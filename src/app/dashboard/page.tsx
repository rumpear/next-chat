import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log(session, 'session');

  return (
    <>
      <h1>DashboardPage</h1>
      <pre>{JSON.stringify(session)}</pre>
    </>
  );
}
