import Header from '@/components/Header';
import MarketList from '@/components/MarketList';
import BottomNav from '@/components/BottomNav';
import MPINLock from '@/components/MPINLock';

export default function MainDashboard() {
  return (
    <MPINLock>
      <div className="max-w-xl mx-auto relative min-h-screen pb-20 bg-gray-50">
        <Header />

        <main className="p-4 flex flex-col gap-4">
          <MarketList />
        </main>

        <BottomNav />
      </div>
    </MPINLock>
  );
}
