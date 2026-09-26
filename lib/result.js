import 'server-only';

import { adminDb } from '@/lib/firebaseAdmin';

const RESULT_COLLECTION = 'results';
const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PANNA_REGEX = /^\d{3}$/;
const ANK_REGEX = /^\d$/;

/* =========================================================
   RESULT VALIDATION
========================================================= */

function clean(value) {
  return String(value ?? '').trim();
}

export function validateDateKey(dateKey) {
  const value = clean(dateKey);

  if (!DATE_KEY_REGEX.test(value)) {
    throw new Error('Invalid result date.');
  }

  const [year, month, day] = value
    .split('-')
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error('Invalid result date.');
  }

  return value;
}

export function validatePanna(value, fieldName) {
  const panna = clean(value);

  if (!PANNA_REGEX.test(panna)) {
    throw new Error(
      `${fieldName} must be exactly 3 digits.`
    );
  }

  return panna;
}

export function validateAnk(value, fieldName) {
  const ank = clean(value);

  if (!ANK_REGEX.test(ank)) {
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

export function buildResult(data = {}) {
  const openPanna = clean(data.openPanna);
  const openAnk = clean(data.openAnk);
  const closeAnk = clean(data.closeAnk);
  const closePanna = clean(data.closePanna);

  const hasOpen =
    Boolean(openPanna && openAnk);

  const hasClose =
    Boolean(closeAnk && closePanna);

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
   HISTORICAL RESULT PATH

   games/{marketId}/results/{YYYY-MM-DD}
========================================================= */

function resultRef(
  marketId,
  dateKey
) {
  const id = clean(marketId);

  if (!id) {
    throw new Error(
      'Market ID is required.'
    );
  }

  const validDateKey =
    validateDateKey(dateKey);

  return adminDb
    .collection('games')
    .doc(id)
    .collection(RESULT_COLLECTION)
    .doc(validDateKey);
}

/* =========================================================
   GET HISTORICAL RESULT
========================================================= */

export async function getHistoricalResult(
  marketId,
  dateKey
) {
  const snapshot =
    await resultRef(
      marketId,
      dateKey
    ).get();

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

  const ref =
    resultRef(
      marketId,
      dateKey
    );

  const existingSnap =
    await ref.get();

  const existing =
    existingSnap.exists
      ? existingSnap.data() || {}
      : {};

  let next = {
    ...existing,
  };

  /* -------------------------
     STAGE 1 — OPEN
  ------------------------- */

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

  /* -------------------------
     STAGE 2 — CLOSE
  ------------------------- */

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

  /* -------------------------
     AUTOMATIC CALCULATION
  ------------------------- */

  const calculated =
    buildResult(next);

  const payload = {
    ...next,
    ...calculated,

    marketId:
      clean(marketId),

    dateKey:
      validateDateKey(dateKey),

    updatedAt:
      new Date(),
  };

  if (!existingSnap.exists) {
    payload.createdAt =
      new Date();
  }

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
