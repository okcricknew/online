'use server';

import { cookies } from 'next/headers';

import { getCurrentSession } from '@/lib/auth';

import {
  saveResultStage,
  getHistoricalResult,
} from '@/lib/result';

/*
 * =========================================================
 * RESULT ACTIONS
 *
 * IMPORTANT:
 *
 * dateKey = BUSINESS RESULT DATE
 *
 * Example:
 *
 * 27 Sep:
 *   Stage 1 = 690-5
 *
 * 28 Sep at 12:15 AM:
 *   Stage 2 = 9-360
 *
 * If dateKey = 2026-09-27,
 * both stages will remain in:
 *
 * games/{marketId}/results/2026-09-27
 *
 * 28 Sep ka fresh result tabhi banega
 * jab dateKey = 2026-09-28 diya jayega.
 *
 * Admin restriction abhi intentionally nahi hai.
 * =========================================================
 */


/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function clean(value) {
  return String(value ?? '').trim();
}

function isValidDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}


/*
 * =========================================================
 * SAVE / UPDATE MARKET RESULT
 * =========================================================
 */

export async function updateMarketResult({
  marketId,
  dateKey,
  stage,
  openPanna,
  openAnk,
  closeAnk,
  closePanna,
}) {
  /*
   * =======================================================
   * 1. LOGIN CHECK
   * =======================================================
   */

  // FIXED: Added await for cookies() in Next.js 15+
  const cookieStore = await cookies();

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
   * =======================================================
   * 2. MARKET ID
   * =======================================================
   */

  const normalizedMarketId =
    clean(marketId);

  if (!normalizedMarketId) {
    return {
      success: false,
      code: 'MARKET_ID_REQUIRED',
      message: 'Market ID is required.',
    };
  }


  /*
   * =======================================================
   * 3. BUSINESS RESULT DATE
   *
   * IMPORTANT:
   * Current date automatically use nahi karenge.
   *
   * User jis result date ko select karega,
   * wahi date Firebase document ke liye use hogi.
   * =======================================================
   */

  const normalizedDateKey =
    clean(dateKey);

  if (!normalizedDateKey) {
    return {
      success: false,
      code: 'DATE_REQUIRED',
      message: 'Result date is required.',
    };
  }

  if (!isValidDateKey(normalizedDateKey)) {
    return {
      success: false,
      code: 'INVALID_DATE',
      message:
        'Invalid result date. Please select a valid date.',
    };
  }


  /*
   * =======================================================
   * 4. STAGE
   * =======================================================
   */

  const normalizedStage =
    clean(stage).toUpperCase();

  if (
    normalizedStage !== 'OPEN' &&
    normalizedStage !== 'CLOSE'
  ) {
    return {
      success: false,
      code: 'INVALID_STAGE',
      message: 'Invalid result stage.',
    };
  }


  /*
   * =======================================================
   * 5. CLEAN RESULT VALUES
   * =======================================================
   */

  const normalizedOpenPanna =
    clean(openPanna);

  const normalizedOpenAnk =
    clean(openAnk);

  const normalizedCloseAnk =
    clean(closeAnk);

  const normalizedClosePanna =
    clean(closePanna);


  /*
   * =======================================================
   * 6. SAVE TO FIREBASE
   *
   * saveResultStage() existing result ko read karke
   * same market + same date par merge karega.
   *
   * OPEN:
   *   690 + 5
   *
   * CLOSE:
   *   9 + 360
   *
   * FINAL:
   *   690-59-360
   * =======================================================
   */

  try {
    const result =
      await saveResultStage({
        marketId:
          normalizedMarketId,

        dateKey:
          normalizedDateKey,

        stage:
          normalizedStage,

        openPanna:
          normalizedOpenPanna,

        openAnk:
          normalizedOpenAnk,

        closeAnk:
          normalizedCloseAnk,

        closePanna:
          normalizedClosePanna,
      });


    /*
     * =====================================================
     * 7. SUCCESS RESPONSE
     * =====================================================
     */

    return {
      success: true,

      code:
        normalizedStage === 'OPEN'
          ? 'OPEN_RESULT_SAVED'
          : 'CLOSE_RESULT_SAVED',

      message:
        normalizedStage === 'OPEN'
          ? 'Open result saved successfully.'
          : 'Close result saved successfully.',

      marketId:
        normalizedMarketId,

      dateKey:
        normalizedDateKey,

      stage:
        normalizedStage,

      result,
    };

  } catch (error) {

    console.error(
      'updateMarketResult error:',
      error
    );

    return {
      success: false,
      code: 'RESULT_UPDATE_FAILED',
      message:
        error?.message ||
        'Unable to update result.',
    };
  }
}


/*
 * =========================================================
 * GET HISTORICAL RESULT
 * =========================================================
 *
 * Example:
 *
 * getMarketResult({
 *   marketId: 'kalyan',
 *   dateKey: '2026-09-27'
 * })
 *
 * Ye exactly selected business date ka result read karega.
 * =========================================================
 */

export async function getMarketResult({
  marketId,
  dateKey,
}) {
  /*
   * =======================================================
   * 1. LOGIN CHECK
   * =======================================================
   */

  // FIXED: Added await for cookies() in Next.js 15+
  const cookieStore = await cookies();

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
   * =======================================================
   * 2. MARKET ID
   * =======================================================
   */

  const normalizedMarketId =
    clean(marketId);

  if (!normalizedMarketId) {
    return {
      success: false,
      code: 'MARKET_ID_REQUIRED',
      message: 'Market ID is required.',
    };
  }


  /*
   * =======================================================
   * 3. BUSINESS RESULT DATE
   * =======================================================
   */

  const normalizedDateKey =
    clean(dateKey);

  if (!normalizedDateKey) {
    return {
      success: false,
      code: 'DATE_REQUIRED',
      message: 'Result date is required.',
    };
  }

  if (!isValidDateKey(normalizedDateKey)) {
    return {
      success: false,
      code: 'INVALID_DATE',
      message:
        'Invalid result date. Please select a valid date.',
    };
  }


  /*
   * =======================================================
   * 4. FIREBASE READ
   * =======================================================
   */

  try {
    const result =
      await getHistoricalResult(
        normalizedMarketId,
        normalizedDateKey
      );


    /*
     * =====================================================
     * 5. SUCCESS
     * =====================================================
     */

    return {
      success: true,

      code: 'RESULT_FETCHED',

      marketId:
        normalizedMarketId,

      dateKey:
        normalizedDateKey,

      result,
    };

  } catch (error) {

    console.error(
      'getMarketResult error:',
      error
    );

    return {
      success: false,
      code: 'RESULT_FETCH_FAILED',
      message:
        error?.message ||
        'Unable to fetch result.',
    };
  }
}
