import 'server-only';

import crypto from 'crypto';
import { adminDb } from './firebaseAdmin';

const SESSION_DAYS = 30;

export async function createSession(userId) {
  const sessionId = crypto
    .randomBytes(32)
    .toString('hex');

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() +
      SESSION_DAYS *
        24 *
        60 *
        60 *
        1000
  );

  await adminDb
    .collection('sessions')
    .doc(sessionId)
    .set({
      userId,
      mpinVerified: false,
      createdAt: now,
      expiresAt,
    });

  return sessionId;
}


export async function getCurrentSession(
  cookieStore
) {
  const cookie = cookieStore.get(
    'auth_token'
  );

  if (!cookie?.value) {
    return null;
  }

  const sessionRef = adminDb
    .collection('sessions')
    .doc(cookie.value);

  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    return null;
  }

  const session = sessionSnap.data();

  // Safe expiry handling
  if (session.expiresAt) {
    const expiresAt =
      typeof session.expiresAt.toDate === 'function'
        ? session.expiresAt.toDate()
        : new Date(session.expiresAt);

    if (
      expiresAt instanceof Date &&
      !Number.isNaN(expiresAt.getTime()) &&
      expiresAt < new Date()
    ) {
      await sessionRef.delete();
      return null;
    }
  }

  if (!session.userId) {
    return null;
  }

  const userSnap = await adminDb
    .collection('users')
    .doc(session.userId)
    .get();

  if (!userSnap.exists) {
    return null;
  }

  // IMPORTANT:
  // User data first, session values after it.
  // Isse user document ka koi field
  // mpinVerified ko overwrite nahi karega.
  return {
    ...userSnap.data(),

    sessionId: sessionSnap.id,

    userId: userSnap.id,

    mpinVerified:
      session.mpinVerified === true,
  };
}
