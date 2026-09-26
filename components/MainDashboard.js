import Header from '@/components/Header';
import MarketList from '@/components/MarketList';
import BottomNav from '@/components/BottomNav';
import MPINForm from '@/components/MPINForm';
import AppSessionGuard from '@/components/AppSessionGuard';

export default function MainDashboard({
  session,
  error,
  isUnlocked,
  mpinUnlocked,
}) {
  const dashboard = (
    <div className="max-w-xl mx-auto relative min-h-dvh pb-8 bg-gray-50">

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
   * Server-side lock.
   *
   * Agar server ke paas app_unlocked cookie nahi hai,
   * to MPIN screen show hogi.
   */
  if (!isUnlocked) {
    return mpinScreen;
  }

  /*
   * Server ne MPIN unlock accept kar liya.
   *
   * mpinUnlocked = 1 sirf successful MPIN verification
   * ke turant baad aata hai.
   */
  return (
    <AppSessionGuard
      lockedContent={mpinScreen}
      unlockOnMount={mpinUnlocked}
    >
      {dashboard}
    </AppSessionGuard>
  );
}
