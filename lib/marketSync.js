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
 * marketSync.js
 *       ↓
 * Firebase games/{marketId}
 *
 * IMPORTANT:
 * Result yahan se overwrite nahi hoga.
 * Result Firebase me persistent rahega.
 *
 * =========================================================
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
   * -------------------------------------------------------
   * CONFIG CHECK
   * -------------------------------------------------------
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
   * -------------------------------------------------------
   * CACHE CHECK
   * -------------------------------------------------------
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
   * -------------------------------------------------------
   * EMPTY CONFIG
   * -------------------------------------------------------
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
   * -------------------------------------------------------
   * FIREBASE BATCH
   * -------------------------------------------------------
   */

  const batch =
    adminDb.batch();

  const syncedMarkets = [];

  /*
   * =======================================================
   * EACH MARKET
   * =======================================================
   */

  for (
    const market of MARKET_CONFIG
  ) {
    /*
     * -----------------------------------------------------
     * MARKET ID
     * -----------------------------------------------------
     */

    if (!market?.id) {
      console.warn(
        'Skipping market without id:',
        market
      );

      continue;
    }

    /*
     * -----------------------------------------------------
     * MARKET TITLE
     * -----------------------------------------------------
     */

    if (!market?.title) {
      console.warn(
        `Skipping market "${market.id}" because title is missing.`
      );

      continue;
    }

    /*
     * -----------------------------------------------------
     * FIREBASE REFERENCE
     * -----------------------------------------------------
     */

    const marketRef =
      adminDb
        .collection('games')
        .doc(market.id);

    /*
     * -----------------------------------------------------
     * SCHEDULE
     * -----------------------------------------------------
     *
     * Schedule code/config se Firebase me sync hoga.
     * -----------------------------------------------------
     */

    const schedule =
      market.schedule &&
      typeof market.schedule ===
        'object'
        ? {
            timezone:
              market.schedule
                .timezone ||
              'Asia/Kolkata',

            openStartTime:
              market.schedule
                .openStartTime ||
              null,

            openEndTime:
              market.schedule
                .openEndTime ||
              null,

            closeEndTime:
              market.schedule
                .closeEndTime ||
              null,

            closedWeekdays:
              Array.isArray(
                market.schedule
                  .closedWeekdays
              )
                ? market.schedule
                    .closedWeekdays
                : [],

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
     * -----------------------------------------------------
     * CONFIG DATA
     * -----------------------------------------------------
     *
     * Sirf market configuration update hogi.
     *
     * Result ko yahan intentionally nahi likh rahe.
     *
     * Isse:
     *
     * Admin result update
     *       ↓
     * Firebase result
     *
     * safe rahega.
     * -----------------------------------------------------
     */

    const firebaseMarket = {
      title:
        market.title,

      active:
        market.active !== false,

      sortOrder:
        Number(
          market.sortOrder ??
            9999
        ),

      schedule,

      managedByConfig:
        true,

      updatedFromConfigAt:
        new Date(),
    };

    /*
     * -----------------------------------------------------
     * FIREBASE WRITE
     * -----------------------------------------------------
     *
     * merge=true:
     *
     * Existing result
     * Existing bids-related data
     * Existing admin data
     *
     * unnecessarily delete nahi hoga.
     * -----------------------------------------------------
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
   * -------------------------------------------------------
   * NO VALID MARKETS
   * -------------------------------------------------------
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
   * COMMIT
   * -------------------------------------------------------
   */

  await batch.commit();

  /*
   * -------------------------------------------------------
   * UPDATE CACHE
   * -------------------------------------------------------
   */

  lastSyncAt =
    Date.now();

  /*
   * -------------------------------------------------------
   * RESPONSE
   * -------------------------------------------------------
   */

  return {
    success: true,

    skipped: false,

    count:
      syncedMarkets.length,

    markets:
      syncedMarkets,
  };
}
