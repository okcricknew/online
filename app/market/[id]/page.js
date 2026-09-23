import Link from 'next/link';

import { getMarketById } from '@/lib/market';

export const dynamic = 'force-dynamic';

export default async function MarketPage({ params }) {
  const { id } = await params;

  const game = await getMarketById(id);

  if (!game) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">⚠️</div>

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

  const state = game.marketState || {};
  const resultInfo = game.resultInfo || {};

  const isClickable =
    state.clickable === true;

  const isOpenPhase =
    state.bidMode === 'OPEN';

  const isClosePhase =
    state.bidMode === 'CLOSE';

  const isClosed =
    state.status === 'CLOSED' ||
    !isClickable;

  const marketTitle =
    game.title ||
    game.name ||
    'MARKET';

  const result =
    resultInfo.display ||
    game.numbers ||
    '***-**-***';

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#18a4e0] text-white shadow-md">
        <div className="mx-auto flex max-w-md items-center px-4 py-4">
          <Link
            href="/"
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl font-bold"
            aria-label="Go back"
          >
            ‹
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold uppercase">
              {marketTitle}
            </h1>

            <p className="text-xs text-white/80">
              Market
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-3 py-4">
        {/* MARKET CARD */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* TITLE + RESULT */}
          <div className="flex items-center justify-between bg-[#18a4e0] px-4 py-4 text-white">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase opacity-80">
                Market
              </p>

              <h2 className="mt-0.5 truncate text-base font-extrabold uppercase">
                {marketTitle}
              </h2>
            </div>

            <div className="ml-3 text-right">
              <p className="text-[10px] font-bold uppercase opacity-80">
                Result
              </p>

              <p className="text-base font-extrabold tracking-wider">
                {result}
              </p>
            </div>
          </div>

          {/* CURRENT STATUS */}
          <div className="p-4">
            <div
              className={[
                'flex items-center justify-between rounded-xl px-3 py-3',
                isClosed
                  ? 'bg-red-50'
                  : 'bg-green-50',
              ].join(' ')}
            >
              <div className="min-w-0">
                <p
                  className={[
                    'text-sm font-extrabold uppercase',
                    isClosed
                      ? 'text-red-600'
                      : 'text-green-600',
                  ].join(' ')}
                >
                  {state.label ||
                    'CLOSED FOR TODAY'}
                </p>

                {state.reason ? (
                  <p className="mt-1 text-[11px] text-gray-500">
                    {state.reason}
                  </p>
                ) : null}
              </div>

              <div
                className={[
                  'ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-black',
                  isClosed
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600',
                ].join(' ')}
              >
                {isClosed ? '×' : '✓'}
              </div>
            </div>
          </div>

          {/* MARKET TIMINGS */}
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] font-bold text-gray-400">
                OPEN BIDS
              </p>

              <p className="mt-1 text-sm font-extrabold text-gray-800">
                {state.openStartTimeLabel ||
                  state.openTimeLabel ||
                  '--'}
              </p>

              {state.openEndTimeLabel ? (
                <p className="mt-0.5 text-[10px] text-gray-400">
                  Till {state.openEndTimeLabel}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] font-bold text-gray-400">
                CLOSE BIDS
              </p>

              <p className="mt-1 text-sm font-extrabold text-gray-800">
                {state.openEndTimeLabel ||
                  state.closeTimeLabel ||
                  '--'}
              </p>

              {state.closeEndTimeLabel ? (
                <p className="mt-0.5 text-[10px] text-gray-400">
                  Till {state.closeEndTimeLabel}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* CURRENT PHASE */}
        <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
          {isClosed ? (
            <div className="py-5 text-center">
              <div className="text-3xl">
                🔒
              </div>

              <h2 className="mt-2 text-base font-extrabold text-gray-800">
                Bidding Closed
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {state.reason ||
                  'Bidding is not available right now.'}
              </p>
            </div>
          ) : (
            <div>
              {/* OPEN PHASE */}
              {isOpenPhase ? (
                <div className="rounded-xl bg-green-50 p-4 text-center">
                  <div className="text-3xl">
                    🟢
                  </div>

                  <h2 className="mt-2 text-base font-extrabold text-green-700">
                    RUNNING FOR OPEN
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    Open bidding is currently running.
                  </p>

                  <div className="mt-3 rounded-lg bg-white px-3 py-2">
                    <p className="text-[10px] font-bold text-gray-400">
                      OPEN BIDDING
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-gray-800">
                      {state.openStartTimeLabel ||
                        '06:00 AM'}
                      {' - '}
                      {state.openEndTimeLabel ||
                        '10:00 AM'}
                    </p>
                  </div>

                  {/* FUTURE BIDDING UI */}
                  <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white p-4">
                    <p className="text-xs font-semibold text-gray-500">
                      Open bidding section will be added here.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* CLOSE PHASE */}
              {isClosePhase ? (
                <div className="rounded-xl bg-blue-50 p-4 text-center">
                  <div className="text-3xl">
                    🔵
                  </div>

                  <h2 className="mt-2 text-base font-extrabold text-blue-700">
                    RUNNING FOR CLOSE
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    Close bidding is currently running.
                  </p>

                  <div className="mt-3 rounded-lg bg-white px-3 py-2">
                    <p className="text-[10px] font-bold text-gray-400">
                      CLOSE BIDDING
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-gray-800">
                      {state.openEndTimeLabel ||
                        '10:00 AM'}
                      {' - '}
                      {state.closeEndTimeLabel ||
                        '11:00 AM'}
                    </p>
                  </div>

                  {/* FUTURE BIDDING UI */}
                  <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white p-4">
                    <p className="text-xs font-semibold text-gray-500">
                      Close bidding section will be added here.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>

        {/* RESULT INFORMATION */}
        <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-800">
              MARKET RESULT
            </h2>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">
              {resultInfo.stage ||
                'PENDING'}
            </span>
          </div>

          <div className="mt-3 rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-2xl font-black tracking-widest text-gray-800">
              {result}
            </p>
          </div>
        </section>

        {/* BACK BUTTON */}
        <Link
          href="/"
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-white py-3 text-sm font-bold text-gray-700 shadow-sm"
        >
          ← Back to Markets
        </Link>
      </div>
    </main>
  );
}
