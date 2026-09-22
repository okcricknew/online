import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import MainDashboard from '@/components/MainDashboard';
import { getCurrentSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams = {},
}) {
  const cookieStore = cookies();

  const session =
    await getCurrentSession(
      cookieStore
    );

  if (!session) {
    redirect('/login');
  }

  const unlockedCookie =
    cookieStore.get(
      'app_unlocked'
    );

  const isUnlocked =
    unlockedCookie?.value === '1';

  return (
    <MainDashboard
      session={session}
      error={searchParams?.error}
      isUnlocked={isUnlocked}
    />
  );
}
