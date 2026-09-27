import 'server-only';

import {
  getMarketById,
  getIndiaNow,
} from '@/lib/market';

function timeToMinutes(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const [hour, minute] =
    value.split(':').map(Number);

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

export async function validateBidWindow({
  marketId,
  bidType,
}) {
  if (!marketId) {
    return {
      allowed: false,
      code: 'MARKET_ID_REQUIRED',
      message: 'Market ID is required.',
    };
  }

  if (
    bidType !== 'OPEN' &&
    bidType !== 'CLOSE'
  ) {
    return {
      allowed: false,
      code: 'INVALID_BID_TYPE',
      message: 'Invalid bid type.',
    };
  }

  const market =
    await getMarketById(marketId);

  if (!market) {
    return {
      allowed: false,
      code: 'MARKET_NOT_FOUND',
      message: 'Market not found.',
    };
  }

  const state =
    market.marketState || {};

  const now = getIndiaNow();

  const nowMinutes =
    now.hour * 60 + now.minute;

  const openStart =
    timeToMinutes(
      state.openStartTime
    );

  const openEnd =
    timeToMinutes(
      state.openEndTime
    );

  const closeEnd =
    timeToMinutes(
      state.closeEndTime
    );

  /*
   * Market timing configuration must be valid.
   */
  if (
    openStart === null ||
    openEnd === null ||
    closeEnd === null ||
    openEnd <= openStart ||
    closeEnd <= openEnd
  ) {
    return {
      allowed: false,
      code: 'INVALID_MARKET_TIMING',
      message:
        'Market bidding time is not configured correctly.',
      market,
      state,
    };
  }

  /*
   * OPEN BID
   *
   * 06:00 AM <= current time < Open End
   */
  if (bidType === 'OPEN') {
    if (
      nowMinutes >= openStart &&
      nowMinutes < openEnd
    ) {
      return {
        allowed: true,
        code: 'OPEN_BID_ALLOWED',
        message:
          'Open bidding is active.',
        market,
        state,
      };
    }

    return {
      allowed: false,
      code: 'OPEN_BIDDING_CLOSED',
      message:
        nowMinutes < openStart
          ? 'Open bidding has not started yet.'
          : 'Open bidding time has ended. Please use Close Dashboard.',
      market,
      state,
    };
  }

  /*
   * CLOSE BID
   *
   * Open End <= current time < Close End
   */
  if (bidType === 'CLOSE') {
    if (
      nowMinutes >= openEnd &&
      nowMinutes < closeEnd
    ) {
      return {
        allowed: true,
        code: 'CLOSE_BID_ALLOWED',
        message:
          'Close bidding is active.',
        market,
        state,
      };
    }

    return {
      allowed: false,
      code: 'CLOSE_BIDDING_CLOSED',
      message:
        nowMinutes < openEnd
          ? 'Close bidding has not started yet.'
          : 'Close bidding time has ended.',
      market,
      state,
    };
  }

  return {
    allowed: false,
    code: 'BID_WINDOW_CLOSED',
    message: 'Bidding is currently closed.',
    market,
    state,
  };
}
