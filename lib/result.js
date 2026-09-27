import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

const RESULT_COLLECTION = 'results';

const DATE_KEY_REGEX =
  /^\d{4}-\d{2}-\d{2}$/;

const PANNA_REGEX =
  /^\d{3}$/;

const ANK_REGEX =
  /^\d$/;

/* =========================================================
   BASIC HELPERS
========================================================= */

function clean(value) {
  return String(value ?? '').trim();
}

/* =========================================================
   DATE VALIDATION

   IMPORTANT:
   dateKey is the BUSINESS RESULT DATE.

   Example:

   27-09-2026 10:00 PM
   -> dateKey = 2026-09-27

   28-09-2026 12:15 AM
   -> Stage 2 can still use
      dateKey = 2026-09-27
========================================================= */

export function validateDateKey(dateKey) {
  const value = clean(dateKey);

  if (!DATE_KEY_REGEX.test(value)) {
    throw new Error(
      'Invalid result date.'
    );
  }

  const [
    year,
    month,
    day,
  ] = value
    .split('-')
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !==
      month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(
      'Invalid result date.'
    );
  }

  return value;
}

/* =========================================================
   PANNA VALIDATION
========================================================= */

export function validatePanna(
  value,
  fieldName
) {
  const panna =
    clean(value);

  if (
    !PANNA_REGEX.test(
      panna
    )
  ) {
    throw new Error(
      `${fieldName} must be exactly 3 digits.`
    );
  }

  return panna;
}

/* =========================================================
   ANK VALIDATION
========================================================= */

export function validateAnk(
  value,
  fieldName
) {
  const ank =
    clean(value);

  if (
    !ANK_REGEX.test(
      ank
    )
  ) {
    throw new Error(
      `${fieldName} must be exactly 1 digit.`
    );
  }

  return ank;
}

/* =========================================================
   RESULT CALCULATION

   Stage 1:
   690-5

   Stage 2:
   9-360

   Final:
   690-59-360

   Jodi:
   59

   Full Sangam:
   690-360

   Half Sangam A:
   690-9

   Half Sangam B:
   5-360
========================================================= */

export function buildResult(
  data = {}
) {
  const openPanna =
    clean(data.openPanna);

  const openAnk =
    clean(data.openAnk);

  const closeAnk =
    clean(data.closeAnk);

  const closePanna =
    clean(data.closePanna);

  const hasOpen =
    Boolean(
      openPanna &&
      openAnk
    );

  const hasClose =
    Boolean(
      closeAnk &&
      closePanna
    );

  const finalResult =
    hasOpen && hasClose
      ? `${openPanna}-${openAnk}${closeAnk}-${closePanna}`
      : '';

  return {
    stage:
      finalResult
        ? 'FINAL'
        : hasClose
          ? 'CLOSE'
          : hasOpen
            ? 'OPEN'
            : 'PENDING',

    openPanna,

    openAnk,

    closeAnk,

    closePanna,

    display:
      finalResult ||
      (
        hasOpen
          ? `${openPanna}-${openAnk}`
          : hasClose
            ? `***-${closeAnk}-${closePanna}`
            : '***-**-***'
      ),

    jodi:
      hasOpen && hasClose
        ? `${openAnk}${closeAnk}`
        : '',

    fullSangam:
      hasOpen && hasClose
        ? `${openPanna}-${closePanna}`
        : '',

    halfSangamA:
      hasOpen && hasClose
        ? `${openPanna}-${closeAnk}`
        : '',

    halfSangamB:
      hasOpen && hasClose
        ? `${openAnk}-${closePanna}`
        : '',
  };
}

/* =========================================================
   FIREBASE RESULT REFERENCE

   games/{marketId}/results/{dateKey}

   Example:

   games/
     MARKET_ID/
       results/
         2026-09-27/
========================================================= */

function resultRef(
  marketId,
  dateKey
) {
  const id =
    clean(marketId);

  if (!id) {
    throw new Error(
      'Market ID is required.'
    );
  }

  const validDateKey =
    validateDateKey(
      dateKey
    );

  return adminDb
    .collection('games')
    .doc(id)
    .collection(
      RESULT_COLLECTION
    )
    .doc(validDateKey);
}

/* =========================================================
   GET HISTORICAL RESULT
========================================================= */

export async function getHistoricalResult(
  marketId,
  dateKey
) {
  const ref =
    resultRef(
      marketId,
      dateKey
    );

  const snapshot =
    await ref.get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/* =========================================================
   SAVE RESULT STAGE

   IMPORTANT:

   dateKey is NOT automatically replaced
   with today's date.

   The date supplied by the result updater
   is treated as the BUSINESS RESULT DATE.

   Example:

   Stage 1:
   dateKey = 2026-09-27
   time = 27 Sep 10:00 PM

   Stage 2:
   dateKey = 2026-09-27
   time = 28 Sep 12:15 AM

   Both are saved here:

   games/MARKET_ID/results/2026-09-27
========================================================= */

export async function saveResultStage({
  marketId,
  dateKey,
  stage,
  openPanna,
  openAnk,
  closeAnk,
  closePanna,
}) {
  const normalizedStage =
    clean(stage).toUpperCase();

  if (
    normalizedStage !== 'OPEN' &&
    normalizedStage !== 'CLOSE'
  ) {
    throw new Error(
      'Invalid result stage.'
    );
  }

  /*
   * Validate the business date
   * BEFORE touching Firebase.
   */

  const validDateKey =
    validateDateKey(
      dateKey
    );

  /*
   * Get the exact historical
   * document for this market/date.
   */

  const ref =
    resultRef(
      marketId,
      validDateKey
    );

  const existingSnap =
    await ref.get();

  const existing =
    existingSnap.exists
      ? existingSnap.data() || {}
      : {};

  /*
   * Preserve the existing stage.

   * This is important:

   * Stage 2 must NOT delete
   * Stage 1 data.
   */

  const next = {
    ...existing,
  };

  /* =======================================================
     STAGE 1 — OPEN
  ======================================================= */

  if (
    normalizedStage === 'OPEN'
  ) {
    next.openPanna =
      validatePanna(
        openPanna,
        'Open Panna'
      );

    next.openAnk =
      validateAnk(
        openAnk,
        'Open Ank'
      );
  }

  /* =======================================================
     STAGE 2 — CLOSE
  ======================================================= */

  if (
    normalizedStage === 'CLOSE'
  ) {
    next.closeAnk =
      validateAnk(
        closeAnk,
        'Close Ank'
      );

    next.closePanna =
      validatePanna(
        closePanna,
        'Close Panna'
      );
  }

  /* =======================================================
     CALCULATE RESULT
  ======================================================= */

  const calculated =
    buildResult(
      next
    );

  /* =======================================================
     FIREBASE PAYLOAD

     dateKey remains the selected
     BUSINESS RESULT DATE.
  ======================================================= */

  const payload = {
    ...next,

    ...calculated,

    marketId:
      clean(marketId),

    dateKey:
      validDateKey,

    updatedAt:
      new Date(),
  };

  /*
   * createdAt is written only
   * when this date's result
   * document is created first time.
   */

  if (
    !existingSnap.exists
  ) {
    payload.createdAt =
      new Date();
  }

  /*
   * merge:true ensures:

   Stage 1
   does not get deleted by Stage 2.

   Stage 2
   does not get deleted by Stage 1.
  */

  await ref.set(
    payload,
    {
      merge: true,
    }
  );

  return {
    id: ref.id,

    ...payload,
  };
}
