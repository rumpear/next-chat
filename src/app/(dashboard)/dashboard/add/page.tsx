import AddFriendForm from '@/components/AddFriendForm';

export default async function DashboardAddPage() {
  return (
    <main className='pt-8'>
      <h2 className='font-bold text-5xl mb-8'>Add a friend</h2>
      <AddFriendForm />
    </main>
  );
}
