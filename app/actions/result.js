'use server';
import { db } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export async function updateMarketResultAction(marketId, prevState, formData) {
  const date = formData.get('date');
  const openPanna = formData.get('openPanna');
  const openAnk = formData.get('openAnk');
  const closeAnk = formData.get('closeAnk');
  const closePanna = formData.get('closePanna');

  // Server-side calculation for 2-Phase Results & Sangams
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
    // 1. Historical Date-wise record in Firebase using Admin SDK syntax
    await db
      .collection('markets')
      .doc(marketId)
      .collection('history')
      .doc(date)
      .set(resultData, { merge: true });

    // 2. Current active result update
    await db
      .collection('markets')
      .doc(marketId)
      .set({ currentResult: resultData }, { merge: true });

    revalidatePath(`/market/${marketId}`);
    revalidatePath(`/`);
    return { success: true, message: 'Result successfully updated!' };
  } catch (error) {
    console.error('Firebase Result Update Error:', error);
    return { success: false, message: error.message };
  }
}
