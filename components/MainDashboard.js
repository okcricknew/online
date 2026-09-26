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
    <div className="max-w-xl mx-auto min-h-dvh flex flex-col bg-gray-50 relative">
      <Header
        session={session}
      />

      <main className="flex-1 p-4 pb-20 flex flex-col gap-4">
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

  if (!isUnlocked) {
    return mpinScreen;
  }

  return (
    <AppSessionGuard
      lockedContent={mpinScreen}
      unlockOnMount={mpinUnlocked}
    >
      {dashboard}
    </AppSessionGuard>
  );
}
