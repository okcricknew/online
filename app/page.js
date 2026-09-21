import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MainDashboard from '@/components/MainDashboard';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  // Agar user logged-in nahi hai, toh login page par bhej do
  if (!token) {
    redirect('/login');
  }

  // Agar logged-in hai, toh MainDashboard (MPIN + Header + Market List) render karo
  return <MainDashboard />;
    }
