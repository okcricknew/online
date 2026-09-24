'use server';

import { cookies } from 'next/headers';

import { adminDb } from '@/lib/firebaseAdmin';
import { getCurrentSession } from '@/lib/auth';
import { validateBidWindow } from '@/lib/bid';

export async function submitBid({
  marketId,
  bidType,
  gameType,
  selection,
  amount,
}) {
  /*
   * ========================================
   * 1. USER SESSION CHECK
   * ========================================
   */

  const cookieStore = cookies();

  const session =
    await getCurrentSession(
      cookieStore
    );

  if (!session) {
    return {
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Please login again.',
    };
  }

  /*
   * ========================================
   * 2. BASIC INPUT CHECK
   * ========================================
   */

  if (!marketId) {
    return {
      success: false,
      code: 'MARKET_ID_REQUIRED',
      message: 'Market ID is required.',
    };
  }

  if (
    bidType !== 'OPEN' &&
    bidType !== 'CLOSE'
  ) {
    return {
      success: false,
      code: 'INVALID_BID_TYPE',
      message: 'Invalid bid type.',
    };
  }

  if (!gameType) {
    return {
      success: false,
      code: 'GAME_TYPE_REQUIRED',
      message: 'Game type is required.',
    };
  }

  if (
    selection === undefined ||
    selection === null ||
    String(selection).trim() === ''
  ) {
    return {
      success: false,
      code: 'SELECTION_REQUIRED',
      message: 'Bid selection is required.',
    };
  }

  /*
   * Amount ko number mein convert karo.
   */
  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return {
      success: false,
      code: 'INVALID_AMOUNT',
      message: 'Invalid bid amount.',
    };
  }

  /*
   * ========================================
   * 3. SERVER-SIDE MARKET TIME CHECK
   * ========================================
   *
   * YAHI MAIN SECURITY CHECK HAI.
   *
   * Agar user ka OpenDashboard 10:01 AM par
   * bhi screen par khula hua hai, ye check
   * current server time ke according OPEN bid
   * reject karega.
   */

  const windowCheck =
    await validateBidWindow({
      marketId,
      bidType,
    });

  if (!windowCheck.allowed) {
    return {
      success: false,
      code: windowCheck.code,
      message: windowCheck.message,
    };
  }

  /*
   * ========================================
   * 4. FINAL FIREBASE WRITE
   * ========================================
   *
   * Window check ke BAAD hi bid create hogi.
   */

  const bidRef =
    adminDb
      .collection('bids')
      .doc();

  const now =
    new Date();

  await bidRef.set({
    userId: session.userId,

    marketId,

    bidType,

    gameType,

    selection:
      String(selection).trim(),

    amount: numericAmount,

    status: 'PENDING',

    createdAt: now,

    updatedAt: now,
  });

  /*
   * ========================================
   * 5. SUCCESS
   * ========================================
   */

  return {
    success: true,

    code: 'BID_SUBMITTED',

    message:
      'Bid submitted successfully.',

    bidId: bidRef.id,
  };
}
