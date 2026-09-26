'use server';
import { db } from '@/lib/firebaseAdmin';
import { doc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function updateMarketResultAction(marketId, prevState, formData) {
  const date = formData.get('date');
  const openPanna = formData.get('openPanna');
  const openAnk = formData.get('openAnk');
  const closeAnk = formData.get('closeAnk');
  const closePanna = formData.get('closePanna');

  // Server-side calculation
  const jodi = `${openAnk}${closeAnk}`;
  const fullSangam = `${openPanna}-${jodi}-${closePanna}`;
  const halfSangamA = `${openPanna}-${closeAnk}`;
  const halfSangamB = `${openAnk}-${closePanna}`;

  const resultData = {
    date,
    openPanna,
    openAnk,
    closeAnk,
    closePanna,
    jodi,
    fullSangam,
    halfSangamA,
    halfSangamB,
    updatedAt: new Date().toISOString()
  };

  try {
    // 1. Historical date-wise document reference in Firebase
    const historyRef = doc(db, 'markets', marketId, 'history', date);
    await setDoc(historyRef, resultData, { merge: true });

    // 2. Current active result update
    const marketRef = doc(db, 'markets', marketId);
    await setDoc(marketRef, { currentResult: resultData }, { merge: true });

    revalidatePath(`/market/${marketId}`);
    return { success: true, message: 'Result successfully updated via SSR!' };
  } catch (error) {
    console.error('Firebase SSR Error:', error);
    return { success: false, message: error.message };
  }
}
