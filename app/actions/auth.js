'use server';

import bcrypt from 'bcryptjs';

import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

import { adminDb } from '@/lib/firebaseAdmin';

import {
  createSession,
  getCurrentSession,
} from '@/lib/auth';


// ========================================
// LOGIN
// ========================================

export async function login(formData) {

  const mobile = String(
    formData.get('mobile') || ''
  ).trim();

  const password = String(
    formData.get('password') || ''
  );

  if (!mobile || !password) {
    redirect(
      '/login?error=Please fill all fields'
    );
  }

  const snapshot =
    await adminDb
      .collection('users')
      .where(
        'mobile',
        '==',
        mobile
      )
      .limit(1)
      .get();

  if (snapshot.empty) {
    redirect(
      '/login?error=Invalid login details'
    );
  }

  const userDoc =
    snapshot.docs[0];

  const user =
    userDoc.data();

  if (!user.passwordHash) {
    redirect(
      '/login?error=Invalid login details'
    );
  }

  const passwordValid =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordValid) {
    redirect(
      '/login?error=Invalid login details'
    );
  }

  if (user.active === false) {
    redirect(
      '/login?error=Account disabled'
    );
  }

  const sessionId =
    await createSession(
      userDoc.id
    );

  const cookieStore =
    cookies();

  cookieStore.set(
    'auth_token',
    sessionId,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        'production',
      sameSite: 'lax',
      path: '/',
      maxAge:
        60 * 60 * 24 * 30,
    }
  );

  // IMPORTANT:
  // Login ke baad MPIN dobara maangega.
  cookieStore.delete(
    'app_unlocked'
  );

  // Existing user:
  // Agar MPIN bana hua hai to lock screen.
  // New user ke liye setup page.

  if (user.mpinHash) {
    redirect('/');
  }

  redirect('/setup-mpin');
}


// ========================================
// REGISTER
// ========================================

export async function register(
  formData
) {

  const fullName =
    String(
      formData.get(
        'fullName'
      ) || ''
    ).trim();

  const username =
    String(
      formData.get(
        'username'
      ) || ''
    ).trim();

  const mobile =
    String(
      formData.get(
        'mobile'
      ) || ''
    ).trim();

  const password =
    String(
      formData.get(
        'password'
      ) || ''
    );

  if (
    !fullName ||
    !username ||
    !mobile ||
    !password
  ) {
    redirect(
      '/login?mode=register&error=Please fill all fields'
    );
  }

  const mobileCheck =
    await adminDb
      .collection('users')
      .where(
        'mobile',
        '==',
        mobile
      )
      .limit(1)
      .get();

  if (!mobileCheck.empty) {
    redirect(
      '/login?mode=register&error=Mobile already registered'
    );
  }

  const usernameCheck =
    await adminDb
      .collection('users')
      .where(
        'username',
        '==',
        username
      )
      .limit(1)
      .get();

  if (!usernameCheck.empty) {
    redirect(
      '/login?mode=register&error=Username already exists'
    );
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );

  const userRef =
    adminDb
      .collection('users')
      .doc();

  await userRef.set({
    fullName,
    username,
    mobile,
    passwordHash,

    mpinHash: null,

    active: true,

    notificationsEnabled:
      true,

    createdAt:
      new Date(),
  });

  const sessionId =
    await createSession(
      userRef.id
    );

  const cookieStore =
    cookies();

  cookieStore.set(
    'auth_token',
    sessionId,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        'production',
      sameSite: 'lax',
      path: '/',
      maxAge:
        60 * 60 * 24 * 30,
    }
  );

  cookieStore.delete(
    'app_unlocked'
  );

  redirect(
    '/setup-mpin'
  );
}


// ========================================
// SET MPIN
// ========================================

export async function setMpin(
  formData
) {

  const mpin =
    String(
      formData.get(
        'mpin'
      ) || ''
    ).trim();

  const confirmMpin =
    String(
      formData.get(
        'confirmMpin'
      ) || ''
    ).trim();

  if (
    !mpin ||
    !confirmMpin
  ) {
    redirect(
      '/setup-mpin?error=Please fill both fields'
    );
  }

  if (!/^\d{4}$/.test(mpin)) {
    redirect(
      '/setup-mpin?error=MPIN must be 4 digits'
    );
  }

  if (mpin !== confirmMpin) {
    redirect(
      '/setup-mpin?error=MPINs do not match'
    );
  }

  const cookieStore =
    cookies();

  const authCookie =
    cookieStore.get(
      'auth_token'
    );

  if (!authCookie?.value) {
    redirect('/login');
  }

  const sessionRef =
    adminDb
      .collection('sessions')
      .doc(
        authCookie.value
      );

  const sessionSnap =
    await sessionRef.get();

  if (!sessionSnap.exists) {
    cookieStore.delete(
      'auth_token'
    );

    redirect('/login');
  }

  const session =
    sessionSnap.data();

  if (!session?.userId) {
    cookieStore.delete(
      'auth_token'
    );

    redirect('/login');
  }

  const userRef =
    adminDb
      .collection('users')
      .doc(
        session.userId
      );

  const userSnap =
    await userRef.get();

  if (!userSnap.exists) {
    cookieStore.delete(
      'auth_token'
    );

    redirect('/login');
  }

  const mpinHash =
    await bcrypt.hash(
      mpin,
      12
    );

  await userRef.update({
    mpinHash,
  });

  // MPIN setup complete.
  // Current app unlock.
  cookieStore.set(
  'app_unlocked',
  '1',
  {
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      'production',
    sameSite: 'lax',
    path: '/',
  }
);

  redirect('/');
}


// ========================================
// VERIFY MPIN
// ========================================

export async function verifyMpin(
  formData
) {

  const mpin =
    String(
      formData.get(
        'mpin'
      ) || ''
    ).trim();

  if (!/^\d{4}$/.test(mpin)) {
    redirect(
      '/?error=Invalid MPIN'
    );
  }

  const cookieStore =
    cookies();

  const authCookie =
    cookieStore.get(
      'auth_token'
    );

  if (!authCookie?.value) {
    redirect('/login');
  }

  const sessionRef =
    adminDb
      .collection('sessions')
      .doc(
        authCookie.value
      );

  const sessionSnap =
    await sessionRef.get();

  if (!sessionSnap.exists) {
    cookieStore.delete(
      'auth_token'
    );

    redirect('/login');
  }

  const session =
    sessionSnap.data();

  if (!session?.userId) {
    cookieStore.delete(
      'auth_token'
    );

    redirect('/login');
  }

  const userSnap =
    await adminDb
      .collection('users')
      .doc(
        session.userId
      )
      .get();

  if (!userSnap.exists) {
    cookieStore.delete(
      'auth_token'
    );

    redirect('/login');
  }

  const user =
    userSnap.data();

  if (!user.mpinHash) {
    redirect(
      '/setup-mpin'
    );
  }

  const valid =
    await bcrypt.compare(
      mpin,
      user.mpinHash
    );

  if (!valid) {
  cookieStore.delete(
    'app_unlocked'
  );

  redirect(
    '/?error=Invalid MPIN'
  );
  }

  // MPIN correct.
  // Current app unlock.
  cookieStore.set(
  'app_unlocked',
  '1',
  {
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      'production',
    sameSite: 'lax',
    path: '/',
  }
);

  redirect('/');
}


// ========================================
// LOGOUT
// ========================================

export async function logout() {

  const cookieStore =
    cookies();

  const authCookie =
    cookieStore.get(
      'auth_token'
    );

  if (authCookie?.value) {

    await adminDb
      .collection('sessions')
      .doc(
        authCookie.value
      )
      .delete();
  }

  cookieStore.delete(
    'auth_token'
  );

  cookieStore.delete(
    'app_unlocked'
  );

  redirect('/login');
}


// ========================================
// TOGGLE NOTIFICATIONS
// ========================================

export async function toggleNotifications() {

  const cookieStore =
    cookies();

  const session =
    await getCurrentSession(
      cookieStore
    );

  if (!session) {
    redirect('/login');
  }

  await adminDb
    .collection('users')
    .doc(session.userId)
    .update({
      notificationsEnabled:
        !session.notificationsEnabled,
    });

  redirect('/');
}
