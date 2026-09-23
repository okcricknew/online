import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

export const MARKET_TIMEZONE =
  'Asia/Kolkata';

/*
 * =========================================================
 * INDIA DATE / TIME
 * =========================================================
 */

function getIndiaDateParts(
  date = new Date()
) {
  const formatter =
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone:
          MARKET_TIMEZONE,

        year: 'numeric',
        month: '2-digit',
        day: '2-digit',

        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',

        weekday: 'short',

        hour12: false,
      }
    );

  const parts =
    Object.fromEntries(
      formatter
        .formatToParts(date)
        .filter(
          (part) =>
            part.type !==
            'literal'
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

    year:
      Number(parts.year),

    month:
      Number(parts.month),

    day:
      Number(parts.day),

    hour,

    minute:
      Number(parts.minute),

    second:
      Number(parts.second),

    weekday:
      parts.weekday,
  };
}

/*
 * Current India time.
 */
export function getIndiaNow() {
  return getIndiaDateParts(
    new Date()
  );
}

/*
 * =========================================================
 * WEEKDAY
 * =========================================================
 */

const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/*
 * =========================================================
 * TIME HELPERS
 * =========================================================
 */

function normalizeTime(
  value
) {
  if (
    typeof value !==
    'string'
  ) {
    return null;
  }

  const match =
    value
      .trim()
      .match(
        /^(\d{1,2}):(\d{2})$/
      );

  if (!match) {
    return null;
  }

  const hour =
    Number(match[1]);

  const minute =
    Number(match[2]);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return (
    `${String(hour).padStart(2, '0')}:` +
    `${String(minute).padStart(2, '0')}`
  );
}

function timeToMinutes(
  value
) {
  const [
    hour,
    minute,
  ] = value
    .split(':')
    .map(Number);

  return (
    hour * 60 + minute
  );
}

function formatTime(
  value
) {
  if (!value) {
    return '--';
  }

  const [
    hourString,
    minute,
  ] = value.split(':');

  const hour =
    Number(hourString);

  const suffix =
    hour >= 12
      ? 'PM'
      : 'AM';

  const displayHour =
    hour % 12 || 12;

  return (
    `${String(displayHour).padStart(2, '0')}:` +
    `${minute} ${suffix}`
  );
}

/*
 * =========================================================
 * SCHEDULE
 * =========================================================
 */

function getSchedule(
  game,
  dateKey
) {
  const baseSchedule =
    game?.schedule || {};

  /*
   * Date-specific override.
   */
  const override =
    baseSchedule
      ?.overrides?.[dateKey] ||
    game?.overrides?.[dateKey] ||
    null;

  /*
   * -------------------------------------------------------
   * NEW 3-PHASE SYSTEM
   * -------------------------------------------------------
   */

  const openStartTime =
    normalizeTime(
      override?.openStartTime ??
        baseSchedule.openStartTime
    );

  const openEndTime =
    normalizeTime(
      override?.openEndTime ??
        baseSchedule.openEndTime
    );

  const closeEndTime =
    normalizeTime(
      override?.closeEndTime ??
        baseSchedule.closeEndTime
    );

  /*
   * -------------------------------------------------------
   * OLD FIELD FALLBACK
   * -------------------------------------------------------
   *
   * Agar purana Firebase document hai,
   * application completely break nahi hogi.
   */

  const legacyOpenTime =
    normalizeTime(
      override?.openTime ??
        baseSchedule.openTime ??
        game?.openTime
    );

  const legacyCloseTime =
    normalizeTime(
      override?.closeTime ??
        baseSchedule.closeTime ??
        game?.closeTime
    );

  return {
    openStartTime:
      openStartTime ||
      legacyOpenTime,

    openEndTime:
      openEndTime ||
      legacyOpenTime,

    closeEndTime:
      closeEndTime ||
      legacyCloseTime,

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

/*
 * =========================================================
 * CLOSED STATE
 * =========================================================
 */

function getClosedState(
  common,
  reason
) {
  return {
    ...common,

    status: 'CLOSED',

    label:
      'CLOSED FOR TODAY',

    clickable: false,

    bidMode: null,

    reason:
      reason ||
      'Market is closed.',
  };
}

/*
 * =========================================================
 * MARKET STATE
 * =========================================================
 *
 * THREE STATES:
 *
 * 1. RUNNING FOR OPEN
 * 2. RUNNING FOR CLOSE
 * 3. CLOSED FOR TODAY
 *
 * =========================================================
 */

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
      : [];

  /*
   * Common data.
   */
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
      schedule.openStartTime
        ? formatTime(
            schedule.openStartTime
          )
        : '--',

    openEndTimeLabel:
      schedule.openEndTime
        ? formatTime(
            schedule.openEndTime
          )
        : '--',

    closeEndTimeLabel:
      schedule.closeEndTime
        ? formatTime(
            schedule.closeEndTime
          )
        : '--',
  };

  /*
   * =======================================================
   * MARKET DISABLED
   * =======================================================
   */

  if (
    game?.active === false
  ) {
    return getClosedState(
      common,
      'Market is disabled.'
    );
  }

  /*
   * =======================================================
   * DATE CLOSED
   * =======================================================
   */

  if (
    schedule.closed
  ) {
    return getClosedState(
      common,
      schedule.reason ||
        'Holiday'
    );
  }

  /*
   * =======================================================
   * WEEKLY OFF
   * =======================================================
   */

  if (
    closedWeekdays.includes(
      weekdayNumber
    )
  ) {
    return getClosedState(
      common,
      'Weekly off'
    );
  }

  /*
   * =======================================================
   * SCHEDULE MISSING
   * =======================================================
   */

  if (
    !schedule.openStartTime ||
    !schedule.openEndTime ||
    !schedule.closeEndTime
  ) {
    return getClosedState(
      common,
      'Market schedule is not configured.'
    );
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

  /*
   * =======================================================
   * INVALID SCHEDULE
   * =======================================================
   *
   * Required:
   *
   * openStart < openEnd < closeEnd
   */

  if (
    openStartMinutes >=
      openEndMinutes ||
    openEndMinutes >=
      closeEndMinutes
  ) {
    return getClosedState(
      common,
      'Market schedule times are invalid.'
    );
  }

  /*
   * =======================================================
   * BEFORE 06:00
   * =======================================================
   *
   * Market clickable nahi.
   */

  if (
    nowMinutes <
    openStartMinutes
  ) {
    return getClosedState(
      common,
      'Market has not opened yet.'
    );
  }

  /*
   * =======================================================
   * RUNNING FOR OPEN
   * =======================================================
   *
   * 06:00 <= time < 10:00
   */

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

  /*
   * =======================================================
   * RUNNING FOR CLOSE
   * =======================================================
   *
   * 10:00 <= time < 11:00
   */

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

  /*
   * =======================================================
   * CLOSED FOR TODAY
   * =======================================================
   *
   * 11:00 ke baad:
   *
   * clickable = false
   */

  return getClosedState(
    common,
    "Today's market time is over."
  );
}

/*
 * =========================================================
 * RESULT HELPERS
 * =========================================================
 */

/*
 * Value ko safe string banata hai.
 */
function cleanResultValue(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value).trim();
}

/*
 * =========================================================
 * BUILD RESULT
 * =========================================================
 *
 * Stage 1:
 *
 * 247 + 3
 * =>
 * 247-3
 *
 * Stage 2:
 *
 * 5 + 690
 *
 * Jodi:
 *
 * 3 + 5
 * =>
 * 35
 *
 * Final:
 *
 * 247-35-690
 * =========================================================
 */

export function buildMarketResult(
  result
) {
  const openPanna =
    cleanResultValue(
      result?.openPanna
    );

  const openAnk =
    cleanResultValue(
      result?.openAnk
    );

  const closeAnk =
    cleanResultValue(
      result?.closeAnk
    );

  const closePanna =
    cleanResultValue(
      result?.closePanna
    );

  /*
   * No result.
   */

  if (
    !openPanna &&
    !openAnk &&
    !closeAnk &&
    !closePanna
  ) {
    return {
      stage: 0,

      display:
        '***-**-***',

      openPanna,
      openAnk,
      jodi: '',
      closeAnk,
      closePanna,

      isComplete: false,
    };
  }

  /*
   * =======================================================
   * STAGE 1
   * =======================================================
   *
   * Open Panna + Open Ank
   */

  if (
    openPanna &&
    openAnk &&
    !closeAnk &&
    !closePanna
  ) {
    return {
      stage: 1,

      display:
        `${openPanna}-${openAnk}`,

      openPanna,

      openAnk,

      jodi: '',

      closeAnk: '',

      closePanna: '',

      isComplete: false,
    };
  }

  /*
   * =======================================================
   * PARTIAL STAGE 1
   * =======================================================
   */

  if (
    openPanna ||
    openAnk
  ) {
    return {
      stage: 1,

      display:
        `${openPanna || '***'}-${openAnk || '*'}`,

      openPanna,

      openAnk,

      jodi: '',

      closeAnk,

      closePanna,

      isComplete: false,
    };
  }

  /*
   * =======================================================
   * STAGE 2
   * =======================================================
   *
   * Complete final result ke liye
   * Stage 1 bhi required hai.
   */

  if (
    openPanna &&
    openAnk &&
    closeAnk &&
    closePanna
  ) {
    const jodi =
      `${openAnk}${closeAnk}`;

    return {
      stage: 2,

      display:
        `${openPanna}-${jodi}-${closePanna}`,

      openPanna,

      openAnk,

      jodi,

      closeAnk,

      closePanna,

      isComplete: true,
    };
  }

  /*
   * Agar close data aaya hai
   * lekin complete nahi hai.
   */

  return {
    stage: 2,

    display:
      `${openPanna || '***'}-` +
      `${openAnk || '*'}${closeAnk || '*' }-` +
      `${closePanna || '***'}`,

    openPanna,

    openAnk,

    jodi:
      openAnk && closeAnk
        ? `${openAnk}${closeAnk}`
        : '',

    closeAnk,

    closePanna,

    isComplete: false,
  };
}

/*
 * =========================================================
 * NORMALIZE MARKET
 * =========================================================
 */

function normalizeMarket(
  doc,
  now
) {
  const data =
    doc.data() || {};

  const result =
    data.result &&
    typeof data.result ===
      'object'
      ? data.result
      : {};

  const resultInfo =
    buildMarketResult(
      result
    );

  return {
    id:
      doc.id,

    ...data,

    result,

    resultInfo,

    /*
     * Backward compatibility.
     */
    numbers:
      resultInfo.display,

    marketState:
      getMarketState(
        data,
        now
      ),
  };
}

/*
 * =========================================================
 * GET ALL MARKETS
 * =========================================================
 */

export async function getMarkets() {
  const snapshot =
    await adminDb
      .collection('games')
      .get();

  const now =
    getIndiaNow();

  return snapshot.docs
    .map((doc) =>
      normalizeMarket(
        doc,
        now
      )
    )

    /*
     * active=false markets hidden.
     */
    .filter(
      (game) =>
        game.active !== false
    )

    /*
     * Config order.
     */
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

/*
 * =========================================================
 * GET ONE MARKET
 * =========================================================
 */

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

  if (
    !snapshot.exists
  ) {
    return null;
  }

  return normalizeMarket(
    snapshot,
    getIndiaNow()
  );
    }
