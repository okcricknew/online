'use client';

import { useEffect, useState } from 'react';

export default function AppSessionGuard({
  children,
  lockedContent,
}) {
  const [checking, setChecking] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const key = 'laksh365_mpin_unlocked';

    const unlocked =
      sessionStorage.getItem(key);

    if (unlocked === '1') {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }

    setChecking(false);
  }, []);

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
