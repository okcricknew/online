import 'server-only';

import Link from 'next/link';

import {
  getMarkets,
} from '@/lib/market';

import {
  syncMarketsToFirebase,
} from '@/lib/marketSync';

import GameCard from './GameCard';

export default async function MarketList() {
  try {
    await syncMarketsToFirebase();
  } catch (error) {
    console.error(
      'Failed to sync markets to Firebase:',
      error
    );
  }

  let games = [];

  try {
    games = await getMarkets();
  } catch (error) {
    console.error(
      'Failed to load markets:',
      error
    );

    return (
      <section className="px-3 pb-6">
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">
            Unable to load markets.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (!games.length) {
    return (
      <section className="px-3 pb-6">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-700">
            No games available right now.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Markets will appear here when they are
            available.
          </p>
        </div>
      </section>
    );
  }

  // FIX: Serialize games data to plain objects so it passes cleanly to Client Components
  const serializedGames = JSON.parse(JSON.stringify(games));

  return (
    <section
      className="space-y-2 px-0 pb-6"
      aria-label="Available markets"
    >
      {serializedGames.map((game) => {
        const state =
          game.marketState;

        /*
         * CLOSED market:
         *
         * Card dikhega,
         * lekin clickable nahi hoga.
         */
        if (!state?.clickable) {
          return (
            <GameCard
              key={game.id}
              game={game}
            />
          );
        }

        /*
         * OPEN / CLOSE market:
         *
         * Card clickable hoga.
         */
        return (
          <Link
            key={game.id}
            href={`/market/${game.id}`}
            className="block"
            aria-label={`Open ${game.title || 'market'}`}
          >
            <GameCard
              game={game}
            />
          </Link>
        );
      })}
    </section>
  );
}
