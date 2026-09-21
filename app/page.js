import Header from '@/components/Header';
import MarketList from '@/components/MarketList';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  return (
    <div className="max-w-xl mx-auto relative min-h-screen pb-20">
      {/* Header Component */}
      <Header />
      
      {/* Market List Component */}
      <main className="p-4 flex flex-col gap-4">
        <MarketList />
      </main>

      {/* Bottom Navigation Component */}
      <BottomNav />
    </div>
  );
}
