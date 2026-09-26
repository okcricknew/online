import 'server-only';

import Link from 'next/link';

import {
  getMarkets,
} from '@/lib/market';

import {
  syncMarketsToFirebase,
} from '@/lib/marketSync';

import GameCard from './GameCard';

import ResultUpdateButton from './ResultUpdateButton';

export default async function MarketList() {
  /*
   * Code configuration se Firebase markets sync.
   *
   * Isse:
   * marketConfig.js
   *        ↓
   * Firebase games collection
   *
   * automatically update hota rahega.
   */
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

  /*
   * Firebase mein koi market nahi hai.
   */
  if (!games.length) {
    return (
      <section className="px-3 pb-0">
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

  return (
    <section
      className="space-y-2 px-0 pb-0"
      aria-label="Available markets"
    >
      {games.map((game) => {
        const state =
          game.marketState;

        /*
         * =================================================
         * MARKET CONTENT
         *
         * Existing GameCard UI exactly same rahega.
         * Result button card ke bahar rahega.
         * =================================================
         */

        const marketCard = (
          <GameCard
            game={game}
          />
        );

        return (
          <div
            key={game.id}
            className="w-full"
          >
            {/* =============================================
                EXISTING MARKET CARD
            ============================================== */}

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

            {/* =============================================
                UPDATE RESULTS

                Abhi sab users ke liye visible hai.
                Baad me admin mobile-number system
                yahin se control kiya jayega.
            ============================================== */}

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
