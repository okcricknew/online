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
    {/* 
      1. min-h-dvh + flex + flex-col se poori screen height lock ho jati hai.
      2. Isse niche koi unwanted blank space nahi bachega.
    */}
    <div className="max-w-xl mx-auto min-h-dvh flex flex-col bg-gray-50 relative">

      <Header
        session={session}
      />

      {/* 
        flex-1 ki wajah se yeh main section bachi hui poori jagah le lega,
        aur pb-20 se BottomNav ke peeche content chuprega bhi nahi.
      */}
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
