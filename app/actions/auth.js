'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { adminDb } from '@/lib/firebaseAdmin';
import {
  createSession,
  getCurrentSession,
} from '@/lib/auth';

export async function login(formData) {
  const mobile = String(
    formData.get('mobile') || ''
  ).trim();

  const password = String(
    formData.get('password') || ''
  );

  if (!mobile || !password) {
    redirect('/login?error=Please fill all fields');
  }

  const snapshot = await adminDb
    .collection('users')
    .where('mobile', '==', mobile)
    .limit(1)
    .get();

  if (snapshot.empty) {
    redirect('/login?error=Invalid login details');
  }

  const userDoc = snapshot.docs[0];
  const user = userDoc.data();

  const passwordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    redirect('/login?error=Invalid login details');
  }

  if (user.active === false) {
    redirect('/login?error=Account disabled');
  }

  const sessionId = await createSession(userDoc.id);

  const cookieStore = await cookies();

  cookieStore.set('auth_token', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect('/');
}


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

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const userRef = adminDb
    .collection('users')
    .doc();

  await userRef.set({
    fullName,
    username,
    mobile,
    passwordHash,

    mpinHash: null,

    active: true,
    notificationsEnabled: true,
    createdAt: new Date(),
  });

  const sessionId = await createSession(
    userRef.id
  );

  const cookieStore = await cookies();

  cookieStore.set('auth_token', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect('/setup-mpin');
}


export async function setMpin(formData) {
  const mpin = String(
    formData.get('mpin') || ''
  ).trim();

  const confirmMpin = String(
    formData.get('confirmMpin') || ''
  ).trim();

  if (!mpin || !confirmMpin) {
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

  const cookieStore = await cookies();

  const session = await getCurrentSession(
    cookieStore
  );

  if (!session) {
    redirect('/login');
  }

  const userRef = adminDb
    .collection('users')
    .doc(session.userId);

  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    redirect('/login');
  }

  const mpinHash = await bcrypt.hash(
    mpin,
    12
  );

  await userRef.update({
    mpinHash,
  });

  await adminDb
    .collection('sessions')
    .doc(session.sessionId)
    .update({
      mpinVerified: true,
      mpinVerifiedAt: new Date(),
    });

  redirect('/');
}


export async function verifyMpin(formData) {
  const mpin = String(
    formData.get('mpin') || ''
  ).trim();

  if (!/^\d{4}$/.test(mpin)) {
    redirect('/?error=Invalid MPIN');
  }

  const cookieStore = await cookies();

  const session = await getCurrentSession(
    cookieStore
  );

  if (!session) {
    redirect('/login');
  }

  const userSnap = await adminDb
    .collection('users')
    .doc(session.userId)
    .get();

  if (!userSnap.exists) {
    redirect('/login');
  }

  const user = userSnap.data();

  if (!user.mpinHash) {
    redirect('/setup-mpin');
  }

  const valid = await bcrypt.compare(
    mpin,
    user.mpinHash
  );

  if (!valid) {
    redirect('/?error=Invalid MPIN');
  }

  await adminDb
    .collection('sessions')
    .doc(session.sessionId)
    .update({
      mpinVerified: true,
      mpinVerifiedAt: new Date(),
    });

  redirect('/');
}


export async function logout() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get('auth_token');

  if (cookie?.value) {
    await adminDb
      .collection('sessions')
      .doc(cookie.value)
      .delete();
  }

  cookieStore.delete('auth_token');

  redirect('/login');
}


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
