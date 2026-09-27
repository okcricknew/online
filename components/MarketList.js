import 'server-only';

import Link from 'next/link';

import { getMarkets } from '@/lib/market';
import { syncMarketsToFirebase } from '@/lib/marketSync';

import GameCard from './GameCard';
import ResultUpdateButton from './ResultUpdateButton';

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
      <section className="px-3 pb-0">
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
      <section className="px-3 pb-0">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-700">
            No games available right now.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Markets will appear here when they are available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="space-y-2 px-0 pb-0"
      aria-label="Available markets"
    >
      {games.map((game) => {
        const state = game.marketState;

        const marketCard = (
          <GameCard game={game} />
        );

        return (
          <div
            key={game.id}
            className="w-full"
          >
            {state?.clickable ? (
              <Link
                href={`/market/${game.id}`}
                className="block"
                aria-label={`Open ${game.title || 'market'}`}
              >
                {marketCard}
              </Link>
            ) : (
              marketCard
            )}

            <div className="mt-1.5 px-3">
              <ResultUpdateButton
                marketId={game.id}
                marketName={
                  game.title ||
                  game.name ||
                  'MARKET'
                }
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
