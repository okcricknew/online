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

  const snapshot = await adminDb
    .collection('users')
    .where('mobile', '==', mobile)
    .limit(1)
    .get();

  if (snapshot.empty) {
    redirect(
      '/login?error=Invalid login details'
    );
  }

  const userDoc = snapshot.docs[0];
  const user = userDoc.data();

  if (!user.passwordHash) {
    redirect(
      '/login?error=Invalid login details'
    );
  }

  const passwordValid = await bcrypt.compare(
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

  const sessionId = await createSession(
    userDoc.id
  );

  const cookieStore = await cookies();

  cookieStore.set('auth_token', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  // Login ke baad dashboard.
  // Agar MPIN verified nahi hai to dashboard
  // automatically MPIN screen dikhayega.
  redirect('/');
}


// ========================================
// REGISTER
// ========================================

export async function register(formData) {
  const fullName = String(
    formData.get('fullName') || ''
  ).trim();

  const username = String(
    formData.get('username') || ''
  ).trim();

  const mobile = String(
    formData.get('mobile') || ''
  ).trim();

  const password = String(
    formData.get('password') || ''
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

  // Check mobile
  const mobileCheck = await adminDb
    .collection('users')
    .where('mobile', '==', mobile)
    .limit(1)
    .get();

  if (!mobileCheck.empty) {
    redirect(
      '/login?mode=register&error=Mobile already registered'
    );
  }

  // Check username
  const usernameCheck = await adminDb
    .collection('users')
    .where('username', '==', username)
    .limit(1)
    .get();

  if (!usernameCheck.empty) {
    redirect(
      '/login?mode=register&error=Username already exists'
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  // Create user
  const userRef = adminDb
    .collection('users')
    .doc();

  await userRef.set({
    fullName,
    username,
    mobile,
    passwordHash,

    // MPIN abhi create nahi hua
    mpinHash: null,

    active: true,
    notificationsEnabled: true,

    createdAt: new Date(),
  });

  // Create session
  const sessionId = await createSession(
    userRef.id
  );

  // Save session cookie
  const cookieStore = await cookies();

  cookieStore.set('auth_token', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  // New user ko directly MPIN setup par bhejo
  redirect('/setup-mpin');
}


// ========================================
// SET MPIN
// ========================================

export async function setMpin(formData) {
  const mpin = String(
    formData.get('mpin') || ''
  ).trim();

  const confirmMpin = String(
    formData.get('confirmMpin') || ''
  ).trim();

  // Empty check
  if (!mpin || !confirmMpin) {
    redirect(
      '/setup-mpin?error=Please fill both fields'
    );
  }

  // 4 digit check
  if (!/^\d{4}$/.test(mpin)) {
    redirect(
      '/setup-mpin?error=MPIN must be 4 digits'
    );
  }

  // Match check
  if (mpin !== confirmMpin) {
    redirect(
      '/setup-mpin?error=MPINs do not match'
    );
  }

  // Get auth cookie
  const cookieStore = await cookies();

  const authCookie = cookieStore.get(
    'auth_token'
  );

  if (!authCookie?.value) {
    redirect('/login');
  }

  const sessionId = authCookie.value;

  // Directly get session
  const sessionRef = adminDb
    .collection('sessions')
    .doc(sessionId);

  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  const session = sessionSnap.data();

  if (!session?.userId) {
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  // Check session expiry safely
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

      cookieStore.delete('auth_token');

      redirect('/login');
    }
  }

  // Get user
  const userRef = adminDb
    .collection('users')
    .doc(session.userId);

  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  // Hash MPIN
  const mpinHash = await bcrypt.hash(
    mpin,
    12
  );

  // Save MPIN
  await userRef.update({
    mpinHash: mpinHash,
  });

  // Mark current session as verified
  await sessionRef.update({
    mpinVerified: true,
    mpinVerifiedAt: new Date(),
  });

  // Dashboard
  redirect('/');
}


// ========================================
// VERIFY MPIN
// ========================================

export async function verifyMpin(formData) {
  const mpin = String(
    formData.get('mpin') || ''
  ).trim();

  if (!/^\d{4}$/.test(mpin)) {
    redirect('/?error=Invalid MPIN');
  }

  const cookieStore = await cookies();

  const authCookie = cookieStore.get(
    'auth_token'
  );

  if (!authCookie?.value) {
    redirect('/login');
  }

  const sessionId = authCookie.value;

  // Get session directly
  const sessionRef = adminDb
    .collection('sessions')
    .doc(sessionId);

  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  const session = sessionSnap.data();

  if (!session?.userId) {
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  // Get user
  const userSnap = await adminDb
    .collection('users')
    .doc(session.userId)
    .get();

  if (!userSnap.exists) {
    cookieStore.delete('auth_token');
    redirect('/login');
  }

  const user = userSnap.data();

  // MPIN not created
  if (!user.mpinHash) {
    redirect('/setup-mpin');
  }

  // Compare MPIN
  const valid = await bcrypt.compare(
    mpin,
    user.mpinHash
  );

  if (!valid) {
    redirect('/?error=Invalid MPIN');
  }

  // Verify session
  await sessionRef.update({
    mpinVerified: true,
    mpinVerifiedAt: new Date(),
  });

  redirect('/');
}


// ========================================
// LOGOUT
// ========================================

export async function logout() {
  const cookieStore = await cookies();

  const authCookie = cookieStore.get(
    'auth_token'
  );

  if (authCookie?.value) {
    await adminDb
      .collection('sessions')
      .doc(authCookie.value)
      .delete();
  }

  cookieStore.delete('auth_token');

  redirect('/login');
}


// ========================================
// TOGGLE NOTIFICATIONS
// ========================================

export async function toggleNotifications() {
  const cookieStore = await cookies();

  const session = await getCurrentSession(
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
