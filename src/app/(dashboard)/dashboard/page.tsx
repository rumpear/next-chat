import { ROUTES } from '@/constants/routes';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Link
        href={ROUTES.dashboard.add}
        className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
      >
        <h2 className={`${inter.className} text-2xl font-semibold`}>
          Add friend{' '}
          <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
            -&gt;
          </span>
        </h2>
      </Link>
    </main>
  );
}
