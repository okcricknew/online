import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

export const MARKET_TIMEZONE = 'Asia/Kolkata';

const FIXED_OPEN_START = '06:00';

const DEFAULT_RESULT = {
  stage: 'PENDING',
  display: '***-**-***',
  openPanna: '',
  openAnk: '',
  closeAnk: '',
  closePanna: '',
  jodi: '',
  fullSangam: '',
  halfSangamA: '',
  halfSangamB: '',
};

const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getIndiaDateParts(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: MARKET_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
      hour12: false,
    })
      .formatToParts(date)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, p.value])
  );

  const hour =
    Number(parts.hour) === 24
      ? 0
      : Number(parts.hour);

  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: parts.weekday,
  };
}

export function getIndiaNow() {
  return getIndiaDateParts();
}

function getPreviousDateKey(dateKey) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      dateKey || ''
    )
  ) {
    return null;
  }

  const [year, month, day] =
    dateKey.split('-').map(Number);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  date.setUTCDate(
    date.getUTCDate() - 1
  );

  return [
    date.getUTCFullYear(),
    String(
      date.getUTCMonth() + 1
    ).padStart(2, '0'),
    String(
      date.getUTCDate()
    ).padStart(2, '0'),
  ].join('-');
}

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

  const parts = value
    .split(':')
    .map(Number);

  if (parts.length !== 2) {
    return null;
  }

  const [hour, minute] = parts;

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

function formatTime(value) {
  if (!value) {
    return '--';
  }

  const normalized =
    normalizeTime(value);

  if (!normalized) {
    return '--';
  }

  const [hour, minute] =
    normalized.split(':').map(Number);

  const suffix =
    hour >= 12 ? 'PM' : 'AM';

  const displayHour =
    hour % 12 || 12;

  return `${String(
    displayHour
  ).padStart(
    2,
    '0'
  )}:${String(
    minute
  ).padStart(
    2,
    '0'
  )} ${suffix}`;
}

function getSchedule(
  game,
  dateKey
) {
  const base =
    game?.schedule || {};

  const override =
    base?.overrides?.[dateKey] ||
    game?.overrides?.[dateKey] ||
    {};

  return {
    /*
     * IMPORTANT
     * -------------------------
     * Every market starts at
     * exactly 06:00 AM IST.
     *
     * Firebase openStartTime
     * will NOT override this.
     */
    openStartTime:
      FIXED_OPEN_START,

    openEndTime: normalizeTime(
      override?.openEndTime ??
        base?.openEndTime ??
        game?.openEndTime
    ),

    closeEndTime: normalizeTime(
      override?.closeEndTime ??
        base?.closeEndTime ??
        game?.closeEndTime ??
        game?.closeTime
    ),

    timezone:
      base?.timezone ||
      MARKET_TIMEZONE,

    closedWeekdays:
      override?.closedWeekdays ??
      base?.closedWeekdays ??
      game?.closedWeekdays ??
      [],

    closed:
      override?.closed === true,

    reason:
      override?.reason || '',
  };
}

function clean(value) {
  return value == null
    ? ''
    : String(value).trim();
}

export function buildMarketResult(
  result
) {
  const data = result || {};

  const openPanna =
    clean(data.openPanna);

  const openAnk =
    clean(data.openAnk);

  const closeAnk =
    clean(data.closeAnk);

  const closePanna =
    clean(data.closePanna);

  const hasOpen =
    /^\d{3}$/.test(openPanna) &&
    /^\d$/.test(openAnk);

  const hasClose =
    /^\d$/.test(closeAnk) &&
    /^\d{3}$/.test(closePanna);

  /*
   * FINAL RESULT
   *
   * 690 + 5
   * 9 + 360
   *
   * => 690-59-360
   */
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

  /*
   * OPEN RESULT
   *
   * 690-5
   */
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

  /*
   * Partial OPEN result.
   *
   * This normally should not happen
   * because server validation requires
   * both fields, but keeping it here
   * makes display safe.
   */
  if (openPanna || openAnk) {
    return {
      stage: 'OPEN',

      display:
        `${openPanna || '***'}-${openAnk || '*'}`,

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

  /*
   * Partial CLOSE result.
   */
  if (closeAnk || closePanna) {
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

  /*
   * IMPORTANT
   * No result for today's
   * business date.
   */
  return {
    ...DEFAULT_RESULT,
  };
}

async function getHistoricalResult(
  marketId,
  dateKey
) {
  if (!marketId || !dateKey) {
    return null;
  }

  try {
    const snap = await adminDb
      .collection('games')
      .doc(marketId)
      .collection('results')
      .doc(dateKey)
      .get();

    if (!snap.exists) {
      return null;
    }

    return (
      snap.data() || null
    );
  } catch (error) {
    console.error(
      `Failed to load result ${marketId}/${dateKey}:`,
      error
    );

    return null;
  }
}

function getResultBusinessDate(
  game,
  now
) {
  /*
   * Business day starts at 06:00 AM.
   *
   * Example:
   *
   * 27 Sep 10:00 PM
   * => 2026-09-27
   *
   * 28 Sep 02:00 AM
   * => 2026-09-27
   *
   * 28 Sep 05:59 AM
   * => 2026-09-27
   *
   * 28 Sep 06:00 AM
   * => 2026-09-28
   */
  const schedule =
    getSchedule(
      game,
      now.dateKey
    );

  const startMinutes =
    timeToMinutes(
      schedule.openStartTime
    );

  const nowMinutes =
    now.hour * 60 +
    now.minute;

  if (
    startMinutes === null
  ) {
    return now.dateKey;
  }

  if (
    nowMinutes < startMinutes
  ) {
    return getPreviousDateKey(
      now.dateKey
    );
  }

  return now.dateKey;
}

async function getMarketDisplayResult(
  marketId,
  game,
  now
) {
  /*
   * This is the most important part.
   *
   * Result is ALWAYS loaded from:
   *
   * games/{marketId}/results/{dateKey}
   *
   * We intentionally DO NOT fallback
   * to game.result.
   *
   * Otherwise old Firebase result could
   * appear again at 06:00 AM.
   */
  const dateKey =
    getResultBusinessDate(
      game,
      now
    );

  const historical =
    await getHistoricalResult(
      marketId,
      dateKey
    );

  if (historical) {
    return {
      result: historical,
      dateKey,
    };
  }

  /*
   * No result for this business date.
   * Therefore show default:
   *
   * ***-**-***
   */
  return {
    result: null,
    dateKey,
  };
}

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
      ? schedule.closedWeekdays
          .map(Number)
          .filter(Number.isFinite)
      : [];

  const common = {
    dateKey: now.dateKey,

    timezone:
      schedule.timezone,

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

  /*
   * MARKET DISABLED
   */
  if (
    game?.active === false
  ) {
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

  /*
   * DATE-SPECIFIC HOLIDAY
   */
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

  /*
   * WEEKLY OFF
   */
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

  /*
   * OPEN END AND CLOSE END
   * ARE COMPULSORY.
   */
  if (
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

  const openStart =
    timeToMinutes(
      schedule.openStartTime
    );

  const openEnd =
    timeToMinutes(
      schedule.openEndTime
    );

  const closeEnd =
    timeToMinutes(
      schedule.closeEndTime
    );

  /*
   * INVALID MARKET TIMING
   *
   * 06:00 -> Open End
   * Open End -> Close End
   */
  if (
    openStart === null ||
    openEnd === null ||
    closeEnd === null ||
    openEnd <= openStart ||
    closeEnd <= openEnd
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

  /*
   * BEFORE 06:00 AM
   */
  if (
    nowMinutes < openStart
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label:
        'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Market starts at 06:00 AM.',
    };
  }

  /*
   * OPEN WINDOW
   *
   * 06:00 <= NOW < OPEN END
   */
  if (
    nowMinutes < openEnd
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

  /*
   * CLOSE WINDOW
   *
   * OPEN END <= NOW < CLOSE END
   */
  if (
    nowMinutes < closeEnd
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

  /*
   * AFTER CLOSE END
   */
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

async function normalizeMarket(
  id,
  data,
  now
) {
  const safeData =
    data || {};

  const marketState =
    getMarketState(
      safeData,
      now
    );

  const displayResult =
    await getMarketDisplayResult(
      id,
      safeData,
      now
    );

  /*
   * If today's business-date result
   * does not exist, buildMarketResult(null)
   * returns ***-**-***.
   */
  const resultInfo =
    buildMarketResult(
      displayResult?.result
    );

  return {
    id,

    ...safeData,

    numbers:
      resultInfo.display,

    resultInfo,

    marketState,

    resultDateKey:
      displayResult?.dateKey ||
      now.dateKey,
  };
}

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
        (doc) =>
          normalizeMarket(
            doc.id,
            doc.data() || {},
            now
          )
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
          a.sortOrder ?? 9999
        ) -
        Number(
          b.sortOrder ?? 9999
        )
    );
}

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

  return normalizeMarket(
    snapshot.id,
    snapshot.data() || {},
    getIndiaNow()
  );
      }
