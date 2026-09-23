export default function GameCard({ game }) {
  const state = game?.marketState || {};

  const isClosed = state.status === 'CLOSED';
  const isClickable = state.clickable === true;

  const title =
    game?.title ||
    game?.name ||
    'MARKET';

  const numbers =
    game?.numbers ||
    game?.result ||
    '***-**-***';

  const openTime =
    state.openTimeLabel ||
    game?.openBids ||
    '--';

  const closeTime =
    state.closeTimeLabel ||
    game?.closeBids ||
    '--';

  const statusLabel =
    state.label ||
    'CLOSED FOR TODAY';

  return (
    <article
      className={[
        'w-full overflow-hidden rounded-2xl bg-white shadow-sm',
        'border border-gray-100',
        'transition-all duration-200',
        isClickable
          ? 'active:scale-[0.99]'
          : 'opacity-90',
      ].join(' ')}
      aria-disabled={!isClickable}
    >
      {/* TOP MARKET HEADER */}
      <div className="flex items-center justify-between bg-[#18a4e0] px-4 py-3 text-white">
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-extrabold uppercase tracking-wide">
            {title}
          </h2>
        </div>

        <div className="ml-3 shrink-0 text-right">
          <p className="text-[16px] font-extrabold tracking-wider">
            {numbers}
          </p>
        </div>
      </div>

      {/* MARKET STATUS */}
      <div className="px-4 pt-3">
        <div
          className={[
            'flex items-center justify-between rounded-xl px-3 py-2',
            isClosed
              ? 'bg-red-50'
              : 'bg-green-50',
          ].join(' ')}
        >
          <div className="min-w-0">
            <p
              className={[
                'text-[12px] font-extrabold uppercase tracking-wide',
                isClosed
                  ? 'text-red-600'
                  : 'text-green-600',
              ].join(' ')}
            >
              {statusLabel}
            </p>

            {state.reason ? (
              <p className="mt-0.5 truncate text-[10px] text-gray-500">
                {state.reason}
              </p>
            ) : null}
          </div>

          {/* STATUS ICON */}
          <div
            className={[
              'ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-black',
              isClosed
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600',
            ].join(' ')}
            aria-hidden="true"
          >
            {isClosed ? '×' : '✓'}
          </div>
        </div>
      </div>

      {/* OPEN / CLOSE TIME */}
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        {/* OPEN BIDS */}
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
            OPEN BIDS
          </p>

          <p className="mt-0.5 text-[14px] font-extrabold text-gray-800">
            {openTime}
          </p>
        </div>

        {/* CLOSE BIDS */}
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
            CLOSE BIDS
          </p>

          <p className="mt-0.5 text-[14px] font-extrabold text-gray-800">
            {closeTime}
          </p>
        </div>
      </div>

      {/* BOTTOM INDICATOR */}
      <div
        className={[
          'h-1 w-full',
          isClosed
            ? 'bg-red-500'
            : 'bg-green-500',
        ].join(' ')}
      />
    </article>
  );
}