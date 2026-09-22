'use client';

import { useEffect, useState } from 'react';

export default function AppSessionGuard({
  children,
  lockedContent,
  unlockOnMount = false,
}) {
  const [checking, setChecking] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const key =
      'laksh365_mpin_unlocked';

    /*
     * Successful MPIN verification ke baad
     * server unlockOnMount=true bhejega.
     *
     * Is case mein current browser/app session ko
     * unlocked mark karo.
     */
    if (unlockOnMount) {
      sessionStorage.setItem(
        key,
        '1'
      );

      setIsUnlocked(true);
      setChecking(false);

      return;
    }

    /*
     * Normal refresh/navigation.
     *
     * Agar isi browser session mein pehle MPIN
     * successfully enter kiya gaya tha,
     * to dashboard continue rahega.
     */
    const unlocked =
      sessionStorage.getItem(key);

    setIsUnlocked(
      unlocked === '1'
    );

    setChecking(false);
  }, [unlockOnMount]);

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">
          Loading...
        </div>
      </main>
    );
  }

  if (!isUnlocked) {
    return lockedContent;
  }

  return children;
}
