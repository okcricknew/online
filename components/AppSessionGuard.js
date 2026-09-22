'use client';

import { useEffect, useState } from 'react';

export default function AppSessionGuard({
  children,
  lockedContent,
}) {
  const [checking, setChecking] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);

  useEffect(() => {
    const key = 'laksh365_app_open';

    const alreadyOpen =
      sessionStorage.getItem(key);

    if (alreadyOpen === '1') {
      setIsNewOpen(false);
    } else {
      sessionStorage.setItem(key, '1');
      setIsNewOpen(true);
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

  if (isNewOpen) {
    return lockedContent;
  }

  return children;
}
