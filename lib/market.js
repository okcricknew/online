import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

export const MARKET_TIMEZONE = 'Asia/Kolkata';
const FIXED_OPEN_START = '06:00';

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

  const hour = Number(parts.hour) === 24 ? 0 : Number(parts.hour);

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
  return getIndiaDateParts();
}

function getPreviousDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey || '')) {
    return null;
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() - 1);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function normalizeTime(value) {
  if (typeof value !== 'string') return null;

  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) return null;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function timeToMinutes(value) {
  if (typeof value !== 'string') return null;

  const [hour, minute] = value.split(':').map(Number);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  return hour * 60 + minute;
}

function formatTime(value) {
  if (!value) return '--';

  const [hour, minute] = value.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return '--';
  }

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function getSchedule(game, dateKey) {
  const base = game?.schedule || {};
  const override =
    base?.overrides?.[dateKey] ||
    game?.overrides?.[dateKey] ||
    {};

  return {
    // IMPORTANT: Every market starts OPEN at exactly 06:00 AM.
    openStartTime: FIXED_OPEN_START,

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

    timezone: base?.timezone || MARKET_TIMEZONE,

    closedWeekdays:
      override?.closedWeekdays ??
      base?.closedWeekdays ??
      game?.closedWeekdays ??
      [],

    closed: override?.closed === true,
    reason: override?.reason || '',
  };
}

function clean(value) {
  return value == null ? '' : String(value).trim();
}

export function buildMarketResult(result) {
  const data = result || {};

  const openPanna = clean(data.openPanna);
  const openAnk = clean(data.openAnk);
  const closeAnk = clean(data.closeAnk);
  const closePanna = clean(data.closePanna);

  const hasOpen = !!(openPanna && openAnk);
  const hasClose = !!(closeAnk && closePanna);

  if (hasOpen && hasClose) {
    return {
      stage: 'FINAL',
      display: `${openPanna}-${openAnk}${closeAnk}-${closePanna}`,
      openPanna,
      openAnk,
      closeAnk,
      closePanna,
      jodi: `${openAnk}${closeAnk}`,
      fullSangam: `${openPanna}-${closePanna}`,
      halfSangamA: `${openPanna}-${closeAnk}`,
      halfSangamB: `${openAnk}-${closePanna}`,
    };
  }

  if (hasOpen) {
    return {
      stage: 'OPEN',
      display: `${openPanna}-${openAnk}`,
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

  if (openPanna || openAnk) {
    return {
      stage: 'OPEN',
      display: `${openPanna || '***'}-${openAnk || '**'}`,
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

  if (closeAnk || closePanna) {
    return {
      stage: 'CLOSE',
      display: `***-${closeAnk || '*'}-${closePanna || '***'}`,
      openPanna,
      openAnk,
      closeAnk,
      closePanna,
      jodi: openAnk && closeAnk ? `${openAnk}${closeAnk}` : '',
      fullSangam: '',
      halfSangamA: '',
      halfSangamB: '',
    };
  }

  return {
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
}

async function getHistoricalResult(marketId, dateKey) {
  if (!marketId || !dateKey) return null;

  try {
    const snap = await adminDb
      .collection('games')
      .doc(marketId)
      .collection('results')
      .doc(dateKey)
      .get();

    return snap.exists ? snap.data() || null : null;
  } catch (error) {
    console.error(
      `Failed to load result ${marketId}/${dateKey}:`,
      error
    );
    return null;
  }
}

function getResultBusinessDate(game, now) {
  const schedule = getSchedule(game, now.dateKey);
  const startMinutes = timeToMinutes(schedule.openStartTime);
  const nowMinutes = now.hour * 60 + now.minute;

  if (startMinutes === null) return now.dateKey;

  return nowMinutes < startMinutes
    ? getPreviousDateKey(now.dateKey)
    : now.dateKey;
}

async function getMarketDisplayResult(marketId, game, now) {
  const dateKey = getResultBusinessDate(game, now);

  const historical = await getHistoricalResult(
    marketId,
    dateKey
  );

  if (historical) {
    return {
      result: historical,
      dateKey,
    };
  }

  if (game?.result && typeof game.result === 'object') {
    return {
      result: game.result,
      dateKey,
    };
  }

  return {
    result: null,
    dateKey,
  };
}

export function getMarketState(
  game,
  now = getIndiaNow()
) {
  const schedule = getSchedule(game, now.dateKey);

  const weekdayNumber =
    WEEKDAY_INDEX[now.weekday];

  const closedWeekdays = Array.isArray(
    schedule.closedWeekdays
  )
    ? schedule.closedWeekdays.map(Number)
    : [];

  const common = {
    dateKey: now.dateKey,
    timezone: schedule.timezone,
    openStartTime: schedule.openStartTime,
    openEndTime: schedule.openEndTime,
    closeEndTime: schedule.closeEndTime,
    openStartTimeLabel: formatTime(schedule.openStartTime),
    openEndTimeLabel: formatTime(schedule.openEndTime),
    closeEndTimeLabel: formatTime(schedule.closeEndTime),
  };

  if (game?.active === false) {
    return {
      ...common,
      status: 'CLOSED',
      label: 'CLOSED FOR TODAY',
      clickable: false,
      bidMode: null,
      reason: 'Market is disabled.',
    };
  }

  if (schedule.closed) {
    return {
      ...common,
      status: 'CLOSED',
      label: 'CLOSED FOR TODAY',
      clickable: false,
      bidMode: null,
      reason: schedule.reason || 'Holiday',
    };
  }

  if (closedWeekdays.includes(weekdayNumber)) {
    return {
      ...common,
      status: 'CLOSED',
      label: 'CLOSED FOR TODAY',
      clickable: false,
      bidMode: null,
      reason: 'Weekly off',
    };
  }

  if (!schedule.openEndTime || !schedule.closeEndTime) {
    return {
      ...common,
      status: 'CLOSED',
      label: 'CLOSED FOR TODAY',
      clickable: false,
      bidMode: null,
      reason: 'Market schedule is not configured.',
    };
  }

  const nowMinutes = now.hour * 60 + now.minute;
  const openEnd = timeToMinutes(schedule.openEndTime);
  const closeEnd = timeToMinutes(schedule.closeEndTime);
  const openStart = timeToMinutes(FIXED_OPEN_START);

  if (
    openEnd === null ||
    closeEnd === null ||
    openStart === null ||
    openEnd <= openStart ||
    closeEnd <= openEnd
  ) {
    return {
      ...common,
      status: 'CLOSED',
      label: 'CLOSED FOR TODAY',
      clickable: false,
      bidMode: null,
      reason: 'Market schedule is invalid.',
    };
  }

  if (nowMinutes < openStart) {
    return {
      ...common,
      status: 'CLOSED',
      label: 'CLOSED FOR TODAY',
      clickable: false,
      bidMode: null,
      reason: 'Market starts at 06:00 AM.',
    };
  }

  if (nowMinutes < openEnd) {
    return {
      ...common,
      status: 'OPEN',
      label: 'RUNNING FOR OPEN',
      clickable: true,
      bidMode: 'OPEN',
      reason: '',
    };
  }

  if (nowMinutes < closeEnd) {
    return {
      ...common,
      status: 'CLOSE',
      label: 'RUNNING FOR CLOSE',
      clickable: true,
      bidMode: 'CLOSE',
      reason: '',
    };
  }

  return {
    ...common,
    status: 'CLOSED',
    label: 'CLOSED FOR TODAY',
    clickable: false,
    bidMode: null,
    reason: "Today's bidding time is over.",
  };
}

async function normalizeMarket(id, data, now) {
  const safeData = data || {};

  const marketState = getMarketState(
    safeData,
    now
  );

  const displayResult =
    await getMarketDisplayResult(
      id,
      safeData,
      now
    );

  const resultInfo = buildMarketResult(
    displayResult?.result
  );

  return {
    id,
    ...safeData,
    numbers: resultInfo.display,
    resultInfo,
    marketState,
    resultDateKey:
      displayResult?.dateKey || now.dateKey,
  };
}

export async function getMarkets() {
  const snapshot = await adminDb
    .collection('games')
    .get();

  const now = getIndiaNow();

  const markets = await Promise.all(
    snapshot.docs.map((doc) =>
      normalizeMarket(
        doc.id,
        doc.data() || {},
        now
      )
    )
  );

  return markets
    .filter((game) => game.active !== false)
    .sort(
      (a, b) =>
        Number(a.sortOrder ?? 9999) -
        Number(b.sortOrder ?? 9999)
    );
}

export async function getMarketById(id) {
  if (!id) return null;

  const snapshot = await adminDb
    .collection('games')
    .doc(id)
    .get();

  if (!snapshot.exists) return null;

  return normalizeMarket(
    snapshot.id,
    snapshot.data() || {},
    getIndiaNow()
  );
}
