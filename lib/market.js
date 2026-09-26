import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

export const MARKET_TIMEZONE = 'Asia/Kolkata';

/* =========================================================
   INDIA DATE / TIME
========================================================= */

function getIndiaDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: MARKET_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter(
        (part) => part.type !== 'literal'
      )
      .map((part) => [
        part.type,
        part.value,
      ])
  );

  const hour =
    Number(parts.hour) === 24
      ? 0
      : Number(parts.hour);

  return {
    dateKey:
      `${parts.year}-${parts.month}-${parts.day}`,

    year: Number(parts.year),

    month: Number(parts.month),

    day: Number(parts.day),

    hour,

    minute: Number(parts.minute),

    second: Number(parts.second),

    weekday: parts.weekday,
  };
}

const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getIndiaNow() {
  return getIndiaDateParts(new Date());
}

/* =========================================================
   TIME HELPERS
========================================================= */

function normalizeTime(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return `${String(hour).padStart(
    2,
    '0'
  )}:${String(minute).padStart(
    2,
    '0'
  )}`;
}

function timeToMinutes(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const parts = value.split(':');

  if (parts.length !== 2) {
    return null;
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }

  return hour * 60 + minute;
}

function formatTime(value) {
  if (!value) {
    return '--';
  }

  const parts = value.split(':');

  if (parts.length !== 2) {
    return '--';
  }

  const hour = Number(parts[0]);
  const minute = parts[1];

  const suffix =
    hour >= 12
      ? 'PM'
      : 'AM';

  const displayHour =
    hour % 12 || 12;

  return `${String(
    displayHour
  ).padStart(
    2,
    '0'
  )}:${minute} ${suffix}`;
}

/* =========================================================
   SCHEDULE
========================================================= */

function getSchedule(game, dateKey) {
  const baseSchedule =
    game?.schedule &&
    typeof game.schedule === 'object'
      ? game.schedule
      : {};

  const override =
    baseSchedule.overrides?.[dateKey] ||
    game?.overrides?.[dateKey] ||
    null;

  const openStartTime =
    normalizeTime(
      override?.openStartTime ??
        baseSchedule.openStartTime ??
        baseSchedule.openTime ??
        game?.openStartTime ??
        game?.openTime
    );

  const openEndTime =
    normalizeTime(
      override?.openEndTime ??
        baseSchedule.openEndTime ??
        game?.openEndTime
    );

  const closeEndTime =
    normalizeTime(
      override?.closeEndTime ??
        baseSchedule.closeEndTime ??
        game?.closeEndTime ??
        game?.closeTime
    );

  return {
    openStartTime,

    openEndTime,

    closeEndTime,

    timezone:
      baseSchedule.timezone ||
      MARKET_TIMEZONE,

    closedWeekdays:
      override?.closedWeekdays ??
      baseSchedule.closedWeekdays ??
      game?.closedWeekdays ??
      [],

    closed:
      override?.closed === true,

    reason:
      override?.reason || '',
  };
}

/* =========================================================
   RESULT HELPERS
========================================================= */

function cleanResultValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value).trim();
}

/* =========================================================
   BUILD MARKET RESULT
========================================================= */

export function buildMarketResult(result) {
  const data =
    result &&
    typeof result === 'object'
      ? result
      : {};

  const openPanna =
    cleanResultValue(
      data.openPanna
    );

  const openAnk =
    cleanResultValue(
      data.openAnk
    );

  const closeAnk =
    cleanResultValue(
      data.closeAnk
    );

  const closePanna =
    cleanResultValue(
      data.closePanna
    );

  const hasOpen =
    Boolean(
      openPanna &&
      openAnk
    );

  const hasClose =
    Boolean(
      closeAnk &&
      closePanna
    );

  /* =======================================================
     FINAL RESULT

     Example:

     Open:
     690-5

     Close:
     9-360

     Final:
     690-59-360
  ======================================================= */

  if (hasOpen && hasClose) {
    return {
      stage: 'FINAL',

      display:
        `${openPanna}-${openAnk}${closeAnk}-${closePanna}`,

      openPanna,

      openAnk,

      closeAnk,

      closePanna,

      jodi:
        `${openAnk}${closeAnk}`,

      fullSangam:
        `${openPanna}-${closePanna}`,

      halfSangamA:
        `${openPanna}-${closeAnk}`,

      halfSangamB:
        `${openAnk}-${closePanna}`,
    };
  }

  /* =======================================================
     OPEN RESULT

     Example:
     690-5
  ======================================================= */

  if (hasOpen) {
    return {
      stage: 'OPEN',

      display:
        `${openPanna}-${openAnk}`,

      openPanna,

      openAnk,

      closeAnk,

      closePanna,

      jodi: '',

      fullSangam: '',

      halfSangamA: '',

      halfSangamB: '',
    };
  }

  /* =======================================================
     OPEN PARTIAL
  ======================================================= */

  if (
    openPanna ||
    openAnk
  ) {
    return {
      stage: 'OPEN',

      display:
        `${openPanna || '***'}-${openAnk || '**'}`,

      openPanna,

      openAnk,

      closeAnk,

      closePanna,

      jodi: '',

      fullSangam: '',

      halfSangamA: '',

      halfSangamB: '',
    };
  }

  /* =======================================================
     CLOSE RESULT / PARTIAL

     Example:
     9-360
  ======================================================= */

  if (
    closeAnk ||
    closePanna
  ) {
    return {
      stage: 'CLOSE',

      display:
        `***-${closeAnk || '*'}-${closePanna || '***'}`,

      openPanna,

      openAnk,

      closeAnk,

      closePanna,

      jodi:
        openAnk && closeAnk
          ? `${openAnk}${closeAnk}`
          : '',

      fullSangam: '',

      halfSangamA: '',

      halfSangamB: '',
    };
  }

  /* =======================================================
     NO RESULT
  ======================================================= */

  return {
    stage: 'PENDING',

    display:
      '***-**-***',

    openPanna: '',

    openAnk: '',

    closeAnk: '',

    closePanna: '',

    jodi: '',

    fullSangam: '',

    halfSangamA: '',

    halfSangamB: '',
  };
}

/* =========================================================
   TODAY HISTORICAL RESULT
========================================================= */

async function getTodayHistoricalResult(
  marketId,
  dateKey
) {
  if (!marketId || !dateKey) {
    return null;
  }

  try {
    const snapshot =
      await adminDb
        .collection('games')
        .doc(marketId)
        .collection('results')
        .doc(dateKey)
        .get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() || null;
  } catch (error) {
    console.error(
      `Failed to load historical result for market ${marketId}:`,
      error
    );

    return null;
  }
}

/* =========================================================
   MARKET STATE
========================================================= */

export function getMarketState(
  game,
  now = getIndiaNow()
) {
  const schedule =
    getSchedule(
      game,
      now.dateKey
    );

  const weekdayNumber =
    WEEKDAY_INDEX[
      now.weekday
    ];

  const closedWeekdays =
    Array.isArray(
      schedule.closedWeekdays
    )
      ? schedule.closedWeekdays.map(
          Number
        )
      : [];

  const common = {
    dateKey:
      now.dateKey,

    timezone:
      schedule.timezone ||
      MARKET_TIMEZONE,

    openStartTime:
      schedule.openStartTime,

    openEndTime:
      schedule.openEndTime,

    closeEndTime:
      schedule.closeEndTime,

    openStartTimeLabel:
      formatTime(
        schedule.openStartTime
      ),

    openEndTimeLabel:
      formatTime(
        schedule.openEndTime
      ),

    closeEndTimeLabel:
      formatTime(
        schedule.closeEndTime
      ),
  };

  /* =======================================================
     MARKET DISABLED
  ======================================================= */

  if (game?.active === false) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Market is disabled.',
    };
  }

  /* =======================================================
     SPECIFIC DATE CLOSED
  ======================================================= */

  if (schedule.closed) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        schedule.reason ||
        'Holiday',
    };
  }

  /* =======================================================
     WEEKLY OFF
  ======================================================= */

  if (
    closedWeekdays.includes(
      weekdayNumber
    )
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Weekly off',
    };
  }

  /* =======================================================
     SCHEDULE MISSING
  ======================================================= */

  if (
    !schedule.openStartTime ||
    !schedule.openEndTime ||
    !schedule.closeEndTime
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Market schedule is not configured.',
    };
  }

  const nowMinutes =
    now.hour * 60 +
    now.minute;

  const openStartMinutes =
    timeToMinutes(
      schedule.openStartTime
    );

  const openEndMinutes =
    timeToMinutes(
      schedule.openEndTime
    );

  const closeEndMinutes =
    timeToMinutes(
      schedule.closeEndTime
    );

  /* =======================================================
     INVALID SCHEDULE
  ======================================================= */

  if (
    openStartMinutes === null ||
    openEndMinutes === null ||
    closeEndMinutes === null ||
    openEndMinutes <=
      openStartMinutes ||
    closeEndMinutes <=
      openEndMinutes
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Market schedule is invalid.',
    };
  }

  /* =======================================================
     BEFORE MARKET START
  ======================================================= */

  if (
    nowMinutes <
    openStartMinutes
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        `Market starts at ${formatTime(
          schedule.openStartTime
        )}.`,
    };
  }

  /* =======================================================
     OPEN WINDOW

     Example:
     06:00 - 10:00
  ======================================================= */

  if (
    nowMinutes <
    openEndMinutes
  ) {
    return {
      ...common,

      status: 'OPEN',

      label:
        'RUNNING FOR OPEN',

      clickable: true,

      bidMode: 'OPEN',

      reason: '',
    };
  }

  /* =======================================================
     CLOSE WINDOW

     Example:
     10:00 - 11:00
  ======================================================= */

  if (
    nowMinutes <
    closeEndMinutes
  ) {
    return {
      ...common,

      status: 'CLOSE',

      label:
        'RUNNING FOR CLOSE',

      clickable: true,

      bidMode: 'CLOSE',

      reason: '',
    };
  }

  /* =======================================================
     MARKET CLOSED
  ======================================================= */

  return {
    ...common,

    status: 'CLOSED',

    label:
      'CLOSED FOR TODAY',

    clickable: false,

    bidMode: null,

    reason:
      "Today's bidding time is over.",
  };
}

/* =========================================================
   NORMALIZE MARKET
========================================================= */

async function normalizeMarket(
  id,
  data,
  now
) {
  const safeData =
    data &&
    typeof data === 'object'
      ? data
      : {};

  /*
   * Load today's historical result.
   *
   * Firebase path:
   *
   * games
   *   └── marketId
   *       └── results
   *           └── YYYY-MM-DD
   */

  const historicalResult =
    await getTodayHistoricalResult(
      id,
      now.dateKey
    );

  /*
   * Historical result has priority.
   * Old game.result remains as fallback.
   */

  const storedResult =
    historicalResult ||
    safeData.result ||
    null;

  const resultInfo =
    buildMarketResult(
      storedResult
    );

  const marketState =
    getMarketState(
      safeData,
      now
    );

  return {
    id,

    ...safeData,

    /*
     * Existing UI uses this.
     */
    numbers:
      resultInfo.display,

    /*
     * Existing GameCard uses this.
     */
    resultInfo,

    /*
     * Existing market schedule UI uses this.
     */
    marketState,
  };
}

/* =========================================================
   GET ALL MARKETS
========================================================= */

export async function getMarkets() {
  const snapshot =
    await adminDb
      .collection('games')
      .get();

  const now =
    getIndiaNow();

  const markets =
    await Promise.all(
      snapshot.docs.map(
        async (doc) => {
          const data =
            doc.data() || {};

          return normalizeMarket(
            doc.id,
            data,
            now
          );
        }
      )
    );

  return markets
    .filter(
      (game) =>
        game.active !== false
    )
    .sort(
      (a, b) =>
        Number(
          a.sortOrder ??
            9999
        ) -
        Number(
          b.sortOrder ??
            9999
        )
    );
}

/* =========================================================
   GET ONE MARKET
========================================================= */

export async function getMarketById(
  id
) {
  if (!id) {
    return null;
  }

  const snapshot =
    await adminDb
      .collection('games')
      .doc(id)
      .get();

  if (!snapshot.exists) {
    return null;
  }

  const data =
    snapshot.data() || {};

  const now =
    getIndiaNow();

  return normalizeMarket(
    snapshot.id,
    data,
    now
  );
}
