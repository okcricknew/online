export default function GameCard({
  game,
}) {
  const title =
    game?.title ||
    game?.name ||
    'MARKET';

  const state =
    game?.marketState || {};

  const resultInfo =
    game?.resultInfo || {};

  const result =
    resultInfo?.display ||
    game?.numbers ||
    game?.result ||
    '***-**-***';

  const label =
    state?.label ||
    'CLOSED FOR TODAY';

  const isOpen =
    state?.clickable === true;

  const isClosed =
    !isOpen;

  return (
    <article
      className={[
        'w-full',
        'rounded-2xl',
        'bg-white',
        'shadow-sm',
        'border',
        'overflow-hidden',
        isOpen
          ? 'border-gray-100'
          : 'border-gray-200',
        isClosed
          ? 'opacity-90'
          : '',
      ].join(' ')}
    >
      {/* =================================================
          TOP SECTION
      ================================================== */}

      <div className="flex items-center justify-between px-4 pt-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-1 text-[11px] text-gray-500">
            {state?.openStartTimeLabel &&
            state?.closeEndTimeLabel
              ? `${state.openStartTimeLabel} - ${state.closeEndTimeLabel}`
              : 'Market timing'}
          </p>
        </div>

        {/* =================================================
            STATUS ICON
        ================================================== */}

        <div
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center',
            'rounded-full text-sm font-bold',
            isOpen
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600',
          ].join(' ')}
          aria-label={
            isOpen
              ? 'Market active'
              : 'Market closed'
          }
        >
          {isOpen ? '✓' : '×'}
        </div>
      </div>

      {/* =================================================
          RESULT
      ================================================== */}

      <div className="px-4 py-4">
        <div
          className={[
            'rounded-xl',
            'px-4 py-3',
            'text-center',
            isOpen
              ? 'bg-gray-50'
              : 'bg-gray-100',
          ].join(' ')}
        >
          <p className="text-2xl font-extrabold tracking-wide text-gray-900">
            {result}
          </p>
        </div>
      </div>

      {/* =================================================
          STATUS
      ================================================== */}

      <div
        className={[
          'border-t px-4 py-3',
          isOpen
            ? 'border-gray-100'
            : 'border-gray-200',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p
              className={[
                'text-sm font-bold',
                isOpen
                  ? 'text-green-600'
                  : 'text-red-600',
              ].join(' ')}
            >
              {label}
            </p>

            {state?.reason ? (
              <p className="mt-1 text-[11px] text-gray-500">
                {state.reason}
              </p>
            ) : null}
          </div>

          {/* =================================================
              PHASE
          ================================================== */}

          {state?.bidMode ? (
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
              {state.bidMode === 'OPEN'
                ? 'OPEN'
                : 'CLOSE'}
            </span>
          ) : null}
        </div>
      </div>

      {/* =================================================
          TIMING INFORMATION
      ================================================== */}

      <div className="grid grid-cols-3 border-t border-gray-100">
        <div className="px-2 py-3 text-center">
          <p className="text-[9px] font-semibold uppercase text-gray-400">
            Open Start
          </p>

          <p className="mt-1 text-xs font-bold text-gray-700">
            {state?.openStartTimeLabel ||
              '--'}
          </p>
        </div>

        <div className="border-x border-gray-100 px-2 py-3 text-center">
          <p className="text-[9px] font-semibold uppercase text-gray-400">
            Open End
          </p>

          <p className="mt-1 text-xs font-bold text-gray-700">
            {state?.openEndTimeLabel ||
              '--'}
          </p>
        </div>

        <div className="px-2 py-3 text-center">
          <p className="text-[9px] font-semibold uppercase text-gray-400">
            Close End
          </p>

          <p className="mt-1 text-xs font-bold text-gray-700">
            {state?.closeEndTimeLabel ||
              '--'}
          </p>
        </div>
      </div>
    </article>
  );
}
