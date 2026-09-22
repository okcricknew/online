import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import MainDashboard from '@/components/MainDashboard';
import { getCurrentSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}) {
  const params = searchParams || {};

  const cookieStore = await cookies();

  const session =
    await getCurrentSession(cookieStore);

  if (!session) {
    redirect('/login');
  }

  return (
    <MainDashboard
      session={session}
      error={params.error}
    />
  );
}
