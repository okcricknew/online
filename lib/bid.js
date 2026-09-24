import 'server-only';

import { getMarketById } from '@/lib/market';

/**
 * Server-side bid window validation.
 *
 * IMPORTANT:
 * Client/browser ke time par trust nahi karna hai.
 * Har bid submit hone se just pehle server current
 * market state check karega.
 */
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

  /*
   * OPEN bid
   */
  if (bidType === 'OPEN') {
    if (
      state.status !== 'OPEN' ||
      state.bidMode !== 'OPEN' ||
      state.clickable !== true
    ) {
      return {
        allowed: false,
        code: 'OPEN_BIDDING_CLOSED',
        message:
          'Open bidding time has ended. Please use Close Dashboard.',
        market,
        state,
      };
    }
  }

  /*
   * CLOSE bid
   */
  if (bidType === 'CLOSE') {
    if (
      state.status !== 'CLOSE' ||
      state.bidMode !== 'CLOSE' ||
      state.clickable !== true
    ) {
      return {
        allowed: false,
        code: 'CLOSE_BIDDING_CLOSED',
        message:
          'Close bidding is not available right now.',
        market,
        state,
      };
    }
  }

  /*
   * Everything is valid.
   */
  return {
    allowed: true,
    code: 'BID_WINDOW_OPEN',
    message: 'Bid window is active.',
    market,
    state,
  };
}
