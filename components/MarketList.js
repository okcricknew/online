import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';
import GameCard from './GameCard';

export default async function MarketList() {
  const snapshot = await adminDb
    .collection('games')
    .get();

  const games = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!games.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center">
        No games available right now.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
        />
      ))}
    </div>
  );
}
