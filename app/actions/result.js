'use server';

import { cookies } from 'next/headers';

import { getCurrentSession } from '@/lib/auth';

import {
  saveResultStage,
  getHistoricalResult,
} from '@/lib/result';

/*
 * =========================================================
 * SAVE RESULT
 *
 * Stage 1:
 * 690-5
 *
 * Stage 2:
 * 9-360
 *
 * Same market + same date par result save hoga.
 *
 * IMPORTANT:
 * Abhi admin restriction intentionally nahi hai.
 * Baad me separate admin mobile-number system add hoga.
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

  const cookieStore = cookies();

  const session =
    await getCurrentSession(
      cookieStore
    );

  if (!session) {
    return {
      success: false,
      code: 'UNAUTHORIZED',
      message:
        'Please login again.',
    };
  }

  /*
   * =======================================================
   * 2. MARKET CHECK
   * =======================================================
   */

  if (
    !marketId ||
    String(marketId).trim() === ''
  ) {
    return {
      success: false,
      code: 'MARKET_ID_REQUIRED',
      message:
        'Market ID is required.',
    };
  }

  /*
   * =======================================================
   * 3. DATE CHECK
   * =======================================================
   */

  if (
    !dateKey ||
    String(dateKey).trim() === ''
  ) {
    return {
      success: false,
      code: 'DATE_REQUIRED',
      message:
        'Result date is required.',
    };
  }

  /*
   * =======================================================
   * 4. STAGE CHECK
   * =======================================================
   */

  const normalizedStage =
    String(stage ?? '')
      .trim()
      .toUpperCase();

  if (
    normalizedStage !== 'OPEN' &&
    normalizedStage !== 'CLOSE'
  ) {
    return {
      success: false,
      code: 'INVALID_STAGE',
      message:
        'Invalid result stage.',
    };
  }

  /*
   * =======================================================
   * 5. SAVE RESULT
   * =======================================================
   */

  try {
    const result =
      await saveResultStage({
        marketId:
          String(marketId).trim(),

        dateKey:
          String(dateKey).trim(),

        stage:
          normalizedStage,

        openPanna:
          String(
            openPanna ?? ''
          ).trim(),

        openAnk:
          String(
            openAnk ?? ''
          ).trim(),

        closeAnk:
          String(
            closeAnk ?? ''
          ).trim(),

        closePanna:
          String(
            closePanna ?? ''
          ).trim(),
      });

    /*
     * =====================================================
     * 6. SUCCESS
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
 *
 * Isko market card / result history me use karenge.
 *
 * Example:
 *
 * getMarketResult({
 *   marketId: 'kalyan',
 *   dateKey: '2026-09-27'
 * })
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

  const cookieStore = cookies();

  const session =
    await getCurrentSession(
      cookieStore
    );

  if (!session) {
    return {
      success: false,
      code: 'UNAUTHORIZED',
      message:
        'Please login again.',
    };
  }

  /*
   * =======================================================
   * 2. BASIC CHECK
   * =======================================================
   */

  if (
    !marketId ||
    String(marketId).trim() === ''
  ) {
    return {
      success: false,
      code: 'MARKET_ID_REQUIRED',
      message:
        'Market ID is required.',
    };
  }

  if (
    !dateKey ||
    String(dateKey).trim() === ''
  ) {
    return {
      success: false,
      code: 'DATE_REQUIRED',
      message:
        'Result date is required.',
    };
  }

  /*
   * =======================================================
   * 3. FIREBASE READ
   * =======================================================
   */

  try {
    const result =
      await getHistoricalResult(
        String(marketId).trim(),
        String(dateKey).trim()
      );

    return {
      success: true,

      code: 'RESULT_FETCHED',

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
