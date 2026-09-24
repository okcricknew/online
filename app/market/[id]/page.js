import Link from 'next/link';

import { getMarketById } from '@/lib/market';

import OpenDashboard from '@/components/OpenDashboard';
import CloseDashboard from '@/components/CloseDashboard';

export const dynamic = 'force-dynamic';

export default async function MarketPage({
  params,
}) {
  const { id } = await params;

  const market =
    await getMarketById(id);

  /*
   * Market nahi mila
   */
  if (!market) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">
              ⚠️
            </div>

            <h1 className="mt-3 text-lg font-extrabold text-gray-800">
              Market Not Found
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              This market is no longer available.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-xl bg-[#18a4e0] px-5 py-3 text-sm font-bold text-white"
            >
              Go Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const state =
    market.marketState || {};

  /*
   * ========================================
   * OPEN PHASE
   * 06:00 AM - 10:00 AM
   * ========================================
   */
  if (
    state.status === 'OPEN' &&
    state.bidMode === 'OPEN' &&
    state.clickable === true
  ) {
    return (
      <OpenDashboard
        market={market}
      />
    );
  }

  /*
   * ========================================
   * CLOSE PHASE
   * 10:00 AM - 11:00 AM
   * ========================================
   */
  if (
    state.status === 'CLOSE' &&
    state.bidMode === 'CLOSE' &&
    state.clickable === true
  ) {
    return (
      <CloseDashboard
        market={market}
      />
    );
  }

  /*
   * ========================================
   * CLOSED
   * ========================================
   *
   * Before 06:00 AM
   * After 11:00 AM
   * Sunday
   * Disabled market
   */
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="rounded-b-[28px] bg-[#18a4e0] px-4 pb-5 pt-4 text-white shadow-md">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[38px] font-light leading-none"
            aria-label="Go back"
          >
            ‹
          </Link>

          <h1 className="truncate text-[25px] font-semibold uppercase">
            {market.title || 'MARKET'} DASHBOARD
          </h1>
        </div>
      </header>

      <div className="px-4 py-10">
        <div className="mx-auto max-w-sm rounded-3xl bg-white p-7 text-center shadow-sm">
          <div className="text-4xl">
            🔒
          </div>

          <h2 className="mt-3 text-lg font-extrabold text-gray-800">
            {state.label || 'CLOSED FOR TODAY'}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {state.reason ||
              'Bidding is not available right now.'}
          </p>

          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-xs font-bold text-gray-400">
              MARKET TIMING
            </p>

            <p className="mt-1 text-sm font-extrabold text-gray-800">
              {state.openStartTimeLabel ||
                '06:00 AM'}
              {' - '}
              {state.closeEndTimeLabel ||
                '11:00 AM'}
            </p>
          </div>

          <Link
            href="/"
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#18a4e0] py-3 text-sm font-bold text-white"
          >
            Back to Markets
          </Link>
        </div>
      </div>
    </main>
  );
}
