import Link from 'next/link';

import { getMarketById } from '@/lib/market';

export const dynamic = 'force-dynamic';

/*
 * Open-time betting dashboard
 *
 * Ye dashboard sirf:
 *
 * RUNNING FOR OPEN
 *
 * ke time dikhega.
 *
 * Close phase ke liye alag dashboard
 * baad mein banaya jayega.
 */

const GAME_TYPES = [
  {
    id: 'sp-motor',
    title: 'SP Motor',
    icon: 'motor',
  },
  {
    id: 'dp-motor',
    title: 'DP Motor',
    icon: 'motor',
  },
  {
    id: 'group-jodi',
    title: 'Group Jodi',
    icon: 'group',
  },
  {
    id: 'odd-even',
    title: 'Odd Even',
    icon: 'list',
  },
  {
    id: 'two-digit-panel',
    title: 'Two Digit Panel',
    subtitle: '(CP,SR)',
    icon: 'single',
  },
  {
    id: 'sp-dp-tp',
    title: 'SP DP TP',
    icon: 'linked',
  },
  {
    id: 'red-bracket',
    title: 'Red Bracket',
    icon: 'bracket',
  },
  {
    id: 'digit-based-jodi',
    title: 'Digit Based Jodi',
    icon: 'jodi',
  },
  {
    id: 'choice-pana',
    title: 'Choice Pana',
    icon: 'choice',
  },
  {
    id: 'panel-group',
    title: 'Panel Group',
    icon: 'panel',
  },
  {
    id: 'half-sangam',
    title: 'Half Sangam',
    icon: 'half',
  },
  {
    id: 'full-sangam',
    title: 'Full Sangam',
    icon: 'full',
  },
  {
    id: 'single-digit',
    title: 'Single Digit',
    icon: 'single',
  },
  {
    id: 'single-digit-bulk',
    title: 'Single Digit Bulk',
    icon: 'single',
  },
  {
    id: 'jodi-digit',
    title: 'Jodi Digit',
    icon: 'card',
  },
  {
    id: 'jodi-digit-bulk',
    title: 'Jodi Digit Bulk',
    icon: 'card',
  },
  {
    id: 'single-pana',
    title: 'Single Pana',
    icon: 'pana',
  },
  {
    id: 'single-pana-bulk',
    title: 'Single Pana Bulk',
    icon: 'pana',
  },
  {
    id: 'double-pana',
    title: 'Double Pana',
    icon: 'panel',
  },
  {
    id: 'double-pana-bulk',
    title: 'Double Pana Bulk',
    icon: 'panel',
  },
  {
    id: 'triple-pana',
    title: 'Triple Pana',
    icon: 'triple',
  },
  {
    id: 'triple-pana-bulk',
    title: 'Triple Pana Bulk',
    icon: 'triple',
  },
];

/* =========================================================
   ICONS
========================================================= */

function GameIcon({ type }) {
  if (type === 'group') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="28" cy="22" r="8" />
        <path d="M12 48c0-10 7-16 16-16s16 6 16 16" />

        <circle cx="45" cy="24" r="6" />
        <path d="M43 34c6 1 10 6 10 13" />
      </svg>
    );
  }

  if (type === 'list') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <text
          x="7"
          y="22"
          fontSize="16"
          fill="currentColor"
          stroke="none"
        >
          1
        </text>

        <text
          x="7"
          y="38"
          fontSize="16"
          fill="currentColor"
          stroke="none"
        >
          2
        </text>

        <text
          x="7"
          y="54"
          fontSize="16"
          fill="currentColor"
          stroke="none"
        >
          3
        </text>

        <path d="M28 16h27" />
        <path d="M28 32h27" />
        <path d="M28 48h27" />
      </svg>
    );
  }

  if (type === 'single') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect
          x="14"
          y="10"
          width="36"
          height="44"
          rx="3"
        />

        <circle
          cx="32"
          cy="32"
          r="3"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === 'linked') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect
          x="9"
          y="31"
          width="25"
          height="17"
          rx="4"
        />

        <rect
          x="30"
          y="16"
          width="25"
          height="17"
          rx="4"
        />

        <path d="M28 34l8-8" />
      </svg>
    );
  }

  if (type === 'bracket') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M22 13c-6 0-8 5-8 10v18c0 5 2 10 8 10" />
        <path d="M42 13c6 0 8 5 8 10v18c0 5-2 10-8 10" />
      </svg>
    );
  }

  if (type === 'jodi') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polygon
          points="32,9 47,17 52,32 47,47 32,55 17,47 12,32 17,17"
        />

        <polygon
          points="32,18 41,23 44,32 41,41 32,46 23,41 20,32 23,23"
        />
      </svg>
    );
  }

  if (type === 'choice') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect
          x="13"
          y="12"
          width="38"
          height="38"
          rx="10"
        />

        <path d="M22 32l7 7 14-16" />
      </svg>
    );
  }

  if (type === 'panel') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect
          x="14"
          y="16"
          width="32"
          height="32"
          rx="3"
        />

        <rect
          x="21"
          y="9"
          width="32"
          height="32"
          rx="3"
        />

        <path d="M37 25v12" />
        <path d="M31 31h12" />
      </svg>
    );
  }

  if (type === 'half') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="currentColor"
      >
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={17 + col * 15}
              cy={17 + row * 15}
              r="6"
            />
          ))
        )}

        <g opacity="0.35">
          <circle cx="17" cy="62" r="6" />
          <circle cx="32" cy="62" r="6" />
          <circle cx="47" cy="62" r="6" />
        </g>
      </svg>
    );
  }

  if (type === 'full') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="currentColor"
      >
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={17 + col * 15}
              cy={17 + row * 15}
              r="6"
            />
          ))
        )}
      </svg>
    );
  }

  if (type === 'card') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect
          x="17"
          y="12"
          width="30"
          height="38"
          rx="3"
        />

        <rect
          x="11"
          y="18"
          width="30"
          height="38"
          rx="3"
        />

        <path
          d="M32 27l6 5-6 5-6-5z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }

  if (type === 'pana') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect
          x="13"
          y="13"
          width="38"
          height="38"
          rx="8"
        />

        <path d="M32 22v20" />
        <path d="M22 32h20" />
      </svg>
    );
  }

  if (type === 'triple') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polygon
          points="32,8 48,16 54,32 48,48 32,56 16,48 10,32 16,16"
        />

        <polygon
          points="32,15 43,21 47,32 43,43 32,49 21,43 17,32 21,21"
        />

        <polygon
          points="32,22 38,26 40,32 38,38 32,42 26,38 24,32 26,26"
        />
      </svg>
    );
  }

  /*
   * Default = motor
   */
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <rect
        x="14"
        y="14"
        width="36"
        height="36"
        rx="5"
      />

      <path d="M22 22h20v20H22z" />

      <circle
        cx="32"
        cy="32"
        r="5"
      />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketPage({
  params,
}) {
  const { id } = await params;

  const game =
    await getMarketById(id);

  /*
   * MARKET NOT FOUND
   */
  if (!game) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-xl px-4 py-10 text-center">
          <h1 className="text-xl font-bold text-gray-800">
            Market Not Found
          </h1>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-[#18a4e0] px-6 py-3 text-sm font-bold text-white"
          >
            Back
          </Link>
        </div>
      </main>
    );
  }

  const state =
    game.marketState || {};

  /*
   * IMPORTANT:
   *
   * Ye dashboard sirf OPEN phase mein
   * render hoga.
   */
  const isOpen =
    state.status === 'OPEN' &&
    state.bidMode === 'OPEN' &&
    state.clickable === true;

  /*
   * Close / Closed ke liye abhi
   * separate screen nahi bana rahe.
   */
  if (!isOpen) {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="rounded-b-[28px] bg-[#18a4e0] px-4 pb-5 pt-4 text-white shadow-md">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-4xl font-light leading-none"
              aria-label="Go back"
            >
              ‹
            </Link>

            <h1 className="text-[25px] font-semibold uppercase tracking-tight">
              {game.title || 'MARKET'} DASHBOARD
            </h1>
          </div>
        </header>

        <div className="px-4 py-10 text-center">
          <div className="mx-auto max-w-sm rounded-3xl bg-white p-7 shadow-sm">
            <div className="text-4xl">
              🔒
            </div>

            <h2 className="mt-3 text-lg font-bold text-gray-800">
              {state.label ||
                'CLOSED FOR TODAY'}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Open bidding is not running right now.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-xl bg-[#18a4e0] px-6 py-3 text-sm font-bold text-white"
            >
              Back to Markets
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * OPEN DASHBOARD
   */
  return (
    <main className="min-h-screen bg-white">
      {/* =================================================
          HEADER
      ================================================= */}
      <header className="sticky top-0 z-50 rounded-b-[28px] bg-[#20a4d8] text-white shadow-md">
        <div className="mx-auto flex max-w-xl items-center px-4 pb-5 pt-4">
          <Link
            href="/"
            className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[38px] font-light leading-none"
            aria-label="Go back"
          >
            ‹
          </Link>

          <h1 className="truncate text-[25px] font-semibold uppercase tracking-tight">
            {game.title || 'MARKET'} DASHBOARD
          </h1>
        </div>
      </header>

      {/* =================================================
          GAME GRID
      ================================================= */}
      <section className="mx-auto max-w-xl px-4 pb-8 pt-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-9">
          {GAME_TYPES.map((gameType) => (
            <button
              key={gameType.id}
              type="button"
              className="group flex min-h-[210px] flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-[#eef7ff] via-white to-[#fff2ec] px-3 py-5 text-center shadow-sm transition active:scale-[0.98]"
            >
              {/* ICON BOX */}
              <div className="flex h-[106px] w-[106px] items-center justify-center rounded-xl bg-[#20a4d8] text-white shadow-sm">
                <GameIcon
                  type={gameType.icon}
                />
              </div>

              {/* TITLE */}
              <div className="mt-5 min-h-[48px] flex items-center justify-center">
                <div className="text-[20px] font-medium leading-[1.12] text-black">
                  {gameType.title}

                  {gameType.subtitle ? (
                    <>
                      <br />
                      {gameType.subtitle}
                    </>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
            }
