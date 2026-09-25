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

  return (
    <article className="w-full rounded-xl bg-white shadow-sm border border-gray-200 px-4 py-3.5 space-y-2.5">
      {/* =================================================
          TOP ROW: MARKET TITLE & RESULT
      ================================================== */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 tracking-wide truncate">
          {title}
        </h2>

        <span className="text-[#0284c7] font-extrabold text-sm tracking-wider">
          {result}
        </span>
      </div>

      {/* =================================================
          STATUS LABEL (Running for Open / Closed for Today)
      ================================================== */}
      <div>
        <span
          className={[
            'text-[11px] font-bold uppercase tracking-wide',
            isOpen ? 'text-green-600' : 'text-red-600',
          ].join(' ')}
        >
          {label}
        </span>
      </div>

      {/* =================================================
          BOTTOM ROW: OPEN/CLOSE BIDS & STATUS ICON
      ================================================== */}
      <div className="pt-2.5 border-t border-gray-100 flex items-end justify-between">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider">
              OPEN BIDS
            </p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {state?.openEndTimeLabel || '--'}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider">
              CLOSE BIDS
            </p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {state?.closeEndTimeLabel || '--'}
            </p>
          </div>
        </div>

        {/* Status Circular Badge Icon */}
        <div
          className={[
            'w-7 h-7 rounded-full flex items-center justify-center border-2',
            isOpen
              ? 'border-green-500 bg-green-50 text-green-600'
              : 'border-red-500 bg-red-50 text-red-600',
          ].join(' ')}
          aria-label={isOpen ? 'Market active' : 'Market closed'}
        >
          <span className="text-xs font-extrabold">
            {isOpen ? '✓' : '✕'}
          </span>
        </div>
      </div>
    </article>
  );
}
