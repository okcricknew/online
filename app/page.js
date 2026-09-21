import { adminDb } from '@/lib/firebaseAdmin';
import Header from '@/components/Header';
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

  const demoGames = [
  {
    id: 1,
    title: "LAKSH MORNING",
    numbers: "346-33-157",
    status: "CLOSED",
    openBids: "09:30 AM",
    closeBids: "10:30 AM",
  },
  {
    id: 2,
    title: "SANDHYA MORNING",
    numbers: "170-87-340",
    status: "CLOSED",
    openBids: "10:00 AM",
    closeBids: "11:00 AM",
  },
  {
    id: 3,
    title: "KUBER DAY",
    numbers: "***-**-***",
    status: "RUNNING",
    isOpen: true,
    openBids: "03:40 PM",
    closeBids: "05:40 PM",
  },
];

  return (
    <div className="max-w-xl mx-auto relative min-h-screen">
      <Header />
      
      <main className="p-4 flex flex-col gap-4">
        {(games.length ? games : demoGames).map((game) => (
  <GameCard
    key={game.id}
    game={game}
  />
))}
      </main>

      <BottomNav />
    </div>
  );
}

