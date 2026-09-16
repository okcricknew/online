import { adminDb } from '@/lib/firebaseAdmin';
import Header from '@/components/Header';
import ActionButtons from '@/components/ActionButtons';
import GameCard from '@/components/GameCard';
import BottomNav from '@/components/BottomNav';

// Yeh function Server-Side data fetch karega (SSR)
async function getGamesData() {
  try {
    const snapshot = await adminDb.collection('games').get();
    const games = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return games;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

export default async function Home() {
  const games = await getGamesData();

  return (
    <div className="max-w-xl mx-auto relative min-h-screen">
      <Header />
      <ActionButtons />
      
      <main className="p-4 flex flex-col gap-4">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No games available right now.</p>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

