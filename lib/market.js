import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

export const MARKET_TIMEZONE = 'Asia/Kolkata';

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
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
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

function normalizeTime(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);

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

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(
    2,
    '0'
  )}`;
}

function timeToMinutes(value) {
  const [hour, minute] = value.split(':').map(Number);

  return hour * 60 + minute;
}

function formatTime(value) {
  if (!value) {
    return '--';
  }

  const [hourString, minute] = value.split(':');

  const hour = Number(hourString);

  const suffix = hour >= 12 ? 'PM' : 'AM';

  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(
    2,
    '0'
  )}:${minute} ${suffix}`;
}

function getSchedule(game, dateKey) {
  const baseSchedule = game.schedule || {};

  const override =
    baseSchedule.overrides?.[dateKey] ||
    game.overrides?.[dateKey] ||
    null;

  const openTime = normalizeTime(
    override?.openTime ??
      baseSchedule.openTime ??
      game.openTime
  );

  const closeTime = normalizeTime(
    override?.closeTime ??
      baseSchedule.closeTime ??
      game.closeTime
  );

  return {
    openTime,
    closeTime,

    timezone: MARKET_TIMEZONE,

    closedWeekdays:
      override?.closedWeekdays ??
      baseSchedule.closedWeekdays ??
      game.closedWeekdays ??
      [],

    closed:
      override?.closed === true,

    reason:
      override?.reason || '',
  };
}

/**
 * Market status:
 *
 * Before open time:
 * RUNNING FOR OPEN
 *
 * At/after open time and before close time:
 * RUNNING FOR CLOSE
 *
 * At/after close time:
 * CLOSED FOR TODAY
 */
export function getMarketState(
  game,
  now = getIndiaNow()
) {
  const schedule = getSchedule(
    game,
    now.dateKey
  );

  const weekdayNumber =
    WEEKDAY_INDEX[now.weekday];

  const closedWeekdays = Array.isArray(
    schedule.closedWeekdays
  )
    ? schedule.closedWeekdays.map(Number)
    : [];

  const common = {
    dateKey: now.dateKey,

    timezone: MARKET_TIMEZONE,

    openTime: schedule.openTime,

    closeTime: schedule.closeTime,

    openTimeLabel: schedule.openTime
      ? formatTime(schedule.openTime)
      : '--',

    closeTimeLabel: schedule.closeTime
      ? formatTime(schedule.closeTime)
      : '--',
  };

  /*
   * Firebase active=false
   */
  if (game.active === false) {
    return {
      ...common,

      status: 'CLOSED',

      label: 'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason: 'Market is disabled.',
    };
  }

  /*
   * Specific date closed
   */
  if (schedule.closed) {
    return {
      ...common,

      status: 'CLOSED',

      label: 'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        schedule.reason || 'Holiday',
    };
  }

  /*
   * Weekly off
   */
  if (
    closedWeekdays.includes(
      weekdayNumber
    )
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label: 'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason: 'Weekly off',
    };
  }

  /*
   * Schedule missing
   */
  if (
    !schedule.openTime ||
    !schedule.closeTime
  ) {
    return {
      ...common,

      status: 'CLOSED',

      label: 'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Market schedule is not configured.',
    };
  }

  const nowMinutes =
    now.hour * 60 + now.minute;

  const openMinutes =
    timeToMinutes(
      schedule.openTime
    );

  const closeMinutes =
    timeToMinutes(
      schedule.closeTime
    );

  /*
   * Invalid schedule
   */
  if (closeMinutes <= openMinutes) {
    return {
      ...common,

      status: 'CLOSED',

      label: 'CLOSED FOR TODAY',

      clickable: false,

      bidMode: null,

      reason:
        'Close time must be after open time.',
    };
  }

  /*
   * Before open time
   */
  if (nowMinutes < openMinutes) {
    return {
      ...common,

      status: 'OPEN',

      label: 'RUNNING FOR OPEN',

      clickable: true,

      bidMode: 'OPEN',

      reason: '',
    };
  }

  /*
   * Open time passed,
   * close time not reached
   */
  if (nowMinutes < closeMinutes) {
    return {
      ...common,

      status: 'CLOSE',

      label: 'RUNNING FOR CLOSE',

      clickable: true,

      bidMode: 'CLOSE',

      reason: '',
    };
  }

  /*
   * Close time passed
   */
  return {
    ...common,

    status: 'CLOSED',

    label: 'CLOSED FOR TODAY',

    clickable: false,

    bidMode: null,

    reason:
      "Today's bidding time is over.",
  };
}

/**
 * Get all markets from Firebase.
 *
 * Firebase collection:
 *
 * games
 */
export async function getMarkets() {
  const snapshot =
    await adminDb
      .collection('games')
      .get();

  const now = getIndiaNow();

  return snapshot.docs
    .map((doc) => {
      const data =
        doc.data() || {};

      return {
        id: doc.id,

        ...data,

        marketState:
          getMarketState(
            data,
            now
          ),
      };
    })

    /*
     * active=false markets
     * are hidden from the main list.
     */
    .filter(
      (game) =>
        game.active !== false
    )

    /*
     * Firebase sortOrder
     */
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

/**
 * Get one market.
 *
 * Used by:
 *
 * /market/[id]
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

  if (!snapshot.exists) {
    return null;
  }

  const data =
    snapshot.data() || {};

  return {
    id: snapshot.id,

    ...data,

    marketState:
      getMarketState(data),
  };
}