import Header from '@/components/Header';
import MarketList from '@/components/MarketList';
import BottomNav from '@/components/BottomNav';
import MPINForm from '@/components/MPINForm';

export default function MainDashboard({
  session,
  error,
  isUnlocked,
}) {

  if (!isUnlocked) {
    return (
      <MPINForm
        error={error}
      />
    );
  }

  return (
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
}
