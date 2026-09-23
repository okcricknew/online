import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';
import { MARKET_CONFIG } from '@/lib/marketConfig';

/*
 * =========================================================
 * MARKET SYNC
 * =========================================================
 *
 * marketConfig.js
 *       ↓
 * this file
 *       ↓
 * Firebase games collection
 *
 * =========================================================
 */

/*
 * Server process ke andar unnecessary repeated writes
 * ko kam karne ke liye small cache.
 */
let lastSyncAt = 0;

const SYNC_CACHE_TIME =
  30 * 1000;

/*
 * =========================================================
 * SYNC MARKETS TO FIREBASE
 * =========================================================
 */

export async function syncMarketsToFirebase({
  force = false,
} = {}) {
  /*
   * Config valid hai ya nahi.
   */
  if (
    !Array.isArray(
      MARKET_CONFIG
    )
  ) {
    throw new Error(
      'MARKET_CONFIG must be an array.'
    );
  }

  const now =
    Date.now();

  /*
   * Recently sync hua hai to
   * dobara unnecessary Firebase write nahi.
   */
  if (
    !force &&
    lastSyncAt &&
    now - lastSyncAt <
      SYNC_CACHE_TIME
  ) {
    return {
      success: true,
      skipped: true,
      reason:
        'Recently synced.',
    };
  }

  /*
   * Koi market configured nahi.
   */
  if (
    MARKET_CONFIG.length === 0
  ) {
    return {
      success: true,
      skipped: true,
      reason:
        'No markets configured.',
    };
  }

  /*
   * Firebase batch.
   */
  const batch =
    adminDb.batch();

  const syncedMarkets = [];

  /*
   * Har configured market ko Firebase
   * me sync karenge.
   */
  for (
    const market of MARKET_CONFIG
  ) {
    /*
     * -------------------------------------------------------
     * MARKET ID CHECK
     * -------------------------------------------------------
     */

    if (!market?.id) {
      console.warn(
        'Skipping market without id:',
        market
      );

      continue;
    }

    /*
     * -------------------------------------------------------
     * MARKET TITLE CHECK
     * -------------------------------------------------------
     */

    if (!market?.title) {
      console.warn(
        `Skipping market "${market.id}" because title is missing.`
      );

      continue;
    }

    /*
     * Firebase document reference.
     */
    const marketRef =
      adminDb
        .collection('games')
        .doc(market.id);

    /*
     * -------------------------------------------------------
     * RESULT
     * -------------------------------------------------------
     *
     * Result ko nested structure me save karenge.
     *
     * Example:
     *
     * result: {
     *   openPanna: "247",
     *   openAnk: "3",
     *   closeAnk: "5",
     *   closePanna: "690"
     * }
     *
     * -------------------------------------------------------
     */

    const result =
      market.result &&
      typeof market.result ===
        'object'
        ? {
            openPanna:
              market.result
                .openPanna ?? '',

            openAnk:
              market.result
                .openAnk ?? '',

            closeAnk:
              market.result
                .closeAnk ?? '',

            closePanna:
              market.result
                .closePanna ?? '',
          }
        : {
            openPanna: '',
            openAnk: '',
            closeAnk: '',
            closePanna: '',
          };

    /*
     * -------------------------------------------------------
     * SCHEDULE
     * -------------------------------------------------------
     */

    const schedule =
      market.schedule &&
      typeof market.schedule ===
        'object'
        ? {
            /*
             * India timezone
             */
            timezone:
              market.schedule
                .timezone ||
              'Asia/Kolkata',

            /*
             * 06:00
             */
            openStartTime:
              market.schedule
                .openStartTime ||
              null,

            /*
             * 10:00
             */
            openEndTime:
              market.schedule
                .openEndTime ||
              null,

            /*
             * 11:00
             */
            closeEndTime:
              market.schedule
                .closeEndTime ||
              null,

            /*
             * Weekly off
             */
            closedWeekdays:
              Array.isArray(
                market.schedule
                  .closedWeekdays
              )
                ? market.schedule
                    .closedWeekdays
                : [],

            /*
             * Date-specific overrides
             */
            overrides:
              market.schedule
                .overrides &&
              typeof market.schedule
                .overrides ===
                'object'
                ? market.schedule
                    .overrides
                : {},
          }
        : {
            timezone:
              'Asia/Kolkata',

            openStartTime:
              null,

            openEndTime:
              null,

            closeEndTime:
              null,

            closedWeekdays:
              [],

            overrides: {},
          };

    /*
     * -------------------------------------------------------
     * FIREBASE MARKET DATA
     * -------------------------------------------------------
     */

    const firebaseMarket = {
      /*
       * Market name
       */
      title:
        market.title,

      /*
       * 2-stage result
       */
      result,

      /*
       * Backward compatibility.
       *
       * Purane code ko break na karne ke liye.
       */
      numbers:
        result.openPanna &&
        result.openAnk
          ? `${result.openPanna}-${result.openAnk}`
          : '***-**-***',

      /*
       * Market active/inactive
       */
      active:
        market.active !== false,

      /*
       * Display order
       */
      sortOrder:
        Number(
          market.sortOrder ??
            9999
        ),

      /*
       * New 3-phase schedule
       */
      schedule,

      /*
       * Ye batayega ki document
       * code/config se managed hai.
       */
      managedByConfig:
        true,

      /*
       * Last config sync time.
       */
      updatedFromConfigAt:
        new Date(),
    };

    /*
     * Firebase me merge=true:
     *
     * Bidding ke future fields ya
     * doosre existing fields ko
     * unnecessarily delete nahi karega.
     */
    batch.set(
      marketRef,
      firebaseMarket,
      {
        merge: true,
      }
    );

    syncedMarkets.push({
      id:
        market.id,

      title:
        market.title,
    });
  }

  /*
   * Valid market nahi mila.
   */
  if (
    syncedMarkets.length === 0
  ) {
    return {
      success: true,
      skipped: true,
      reason:
        'No valid markets found.',
    };
  }

  /*
   * -------------------------------------------------------
   * FIREBASE COMMIT
   * -------------------------------------------------------
   */

  await batch.commit();

  /*
   * Last successful sync time.
   */
  lastSyncAt =
    Date.now();

  return {
    success: true,

    skipped: false,

    count:
      syncedMarkets.length,

    markets:
      syncedMarkets,
  };
          }
