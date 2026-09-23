/*
 * =========================================================
 * MARKET CONFIG
 * =========================================================
 *
 * Market ka naam, timing aur result yahin se control hoga.
 *
 * Timezone:
 * India - Asia/Kolkata
 *
 * Market flow:
 *
 * 06:00 AM
 *    ↓
 * RUNNING FOR OPEN
 *    ↓
 * 10:00 AM
 *    ↓
 * RUNNING FOR CLOSE
 *    ↓
 * 11:00 AM
 *    ↓
 * CLOSED FOR TODAY
 *
 * Result:
 *
 * Stage 1:
 * 247-3
 *
 * Stage 2:
 * 5-690
 *
 * Final:
 * 247-35-690
 * =========================================================
 */

export const MARKET_CONFIG = [
  {
    /*
     * Firebase document ID
     */
    id: 'laksh-morning',

    /*
     * Market name
     */
    title: 'LAKSH MORNING',

    /*
     * true  = market visible
     * false = market hidden
     */
    active: true,

    /*
     * Market display order
     */
    sortOrder: 1,

    /*
     * =======================================================
     * MARKET TIMING
     * =======================================================
     */

    schedule: {
      /*
       * India timezone
       */
      timezone: 'Asia/Kolkata',

      /*
       * 06:00 AM se
       *
       * RUNNING FOR OPEN
       */
      openStartTime: '06:00',

      /*
       * 10:00 AM par
       *
       * RUNNING FOR OPEN
       *        ↓
       * RUNNING FOR CLOSE
       */
      openEndTime: '10:00',

      /*
       * 11:00 AM par
       *
       * RUNNING FOR CLOSE
       *        ↓
       * CLOSED FOR TODAY
       *
       * Iske baad market clickable nahi hoga.
       */
      closeEndTime: '11:00',

      /*
       * Weekly off:
       *
       * 0 = Sunday
       * 1 = Monday
       * 2 = Tuesday
       * 3 = Wednesday
       * 4 = Thursday
       * 5 = Friday
       * 6 = Saturday
       */
      closedWeekdays: [0],

      /*
       * Particular date ke liye special closing.
       *
       * Example:
       *
       * overrides: {
       *   '2026-10-02': {
       *     closed: true,
       *     reason: 'Holiday',
       *   },
       * }
       */
      overrides: {},
    },

    /*
     * =======================================================
     * 2-STAGE RESULT
     * =======================================================
     *
     * Stage 1:
     *
     * openPanna = 247
     * openAnk   = 3
     *
     * Result:
     * 247-3
     *
     *
     * Stage 2:
     *
     * closeAnk   = 5
     * closePanna = 690
     *
     * Jodi:
     * 3 + 5 = 35
     *
     * Final:
     * 247-35-690
     *
     * =======================================================
     */

    result: {
      /*
       * Open Panna
       *
       * Example: 247
       */
      openPanna: '',

      /*
       * Open Ank
       *
       * Example: 3
       */
      openAnk: '',

      /*
       * Close Ank
       *
       * Example: 5
       */
      closeAnk: '',

      /*
       * Close Panna
       *
       * Example: 690
       */
      closePanna: '',
    },
  },
];
