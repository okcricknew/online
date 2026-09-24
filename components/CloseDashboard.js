import Link from 'next/link';

const CLOSE_GAME_TYPES = [
  'Single Digit',
  'Jodi Digit',
  'Single Pana',
  'Double Pana',
  'Triple Pana',
  'Single Pana Bulk',
  'Double Pana Bulk',
  'Triple Pana Bulk',
];

function GameIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M8 12h8M12 8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CloseDashboard({
  market,
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}

      <header className="rounded-b-[28px] bg-[#18a4e0] px-4 pb-5 pt-4 text-white shadow-md">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[38px] font-light leading-none"
            aria-label="Go back"
          >
            ‹
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-[25px] font-semibold uppercase">
              {market?.title || 'MARKET'} DASHBOARD
            </h1>

            <p className="mt-1 text-xs font-bold text-white/80">
              RUNNING FOR CLOSE
            </p>
          </div>
        </div>
      </header>

      {/* Close Timing */}

      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400">
                CLOSE BIDDING
              </p>

              <p className="mt-1 text-sm font-extrabold text-gray-800">
                {market?.marketState
                  ?.openEndTimeLabel ||
                  '10:00 AM'}
                {' - '}
                {market?.marketState
                  ?.closeEndTimeLabel ||
                  '11:00 AM'}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <span className="text-lg font-black">
                ✓
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Close Games */}

      <section
        className="grid grid-cols-2 gap-3 px-4 py-4"
        aria-label="Close games"
      >
        {CLOSE_GAME_TYPES.map(
          (gameType) => (
            <Link
              key={gameType}
              href={`/market/${market.id}/close/${encodeURIComponent(
                gameType
              )}`}
              className="flex min-h-[116px] flex-col items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-3 text-center shadow-sm transition active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18a4e0] text-white shadow-sm">
                <GameIcon />
              </div>

              <span className="mt-3 text-xs font-extrabold leading-4 text-gray-700">
                {gameType}
              </span>
            </Link>
          )
        )}
      </section>
    </main>
  );
}
