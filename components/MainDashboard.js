import Header from '@/components/Header';
import MarketList from '@/components/MarketList';
import BottomNav from '@/components/BottomNav';
import MPINForm from '@/components/MPINForm';
import AppSessionGuard from '@/components/AppSessionGuard';

export default function MainDashboard({
  session,
  error,
  isUnlocked,
}) {
  const dashboard = (
    <div className="max-w-xl mx-auto relative min-h-screen pb-20 bg-gray-50">

      <Header
        session={session}
      />

      <main className="p-4 flex flex-col gap-4">
        <MarketList />
      </main>

      <BottomNav />

    </div>
  );

  const mpinScreen = (
    <MPINForm
      error={error}
    />
  );

  /*
   * Server-side MPIN lock.
   *
   * Agar app_unlocked cookie nahi hai,
   * to MPIN screen.
   */
  if (!isUnlocked) {
    return mpinScreen;
  }

  /*
   * app_unlocked cookie hai.
   *
   * Ab client check karega:
   *
   * Refresh:
   *    sessionStorage exists
   *    => Dashboard
   *
   * New app/tab open:
   *    sessionStorage missing
   *    => MPIN
   */
  return (
    <AppSessionGuard
      lockedContent={mpinScreen}
    >
      {dashboard}
    </AppSessionGuard>
  );
}
