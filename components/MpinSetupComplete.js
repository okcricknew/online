'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MpinSetupComplete() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem(
      'laksh365_mpin_unlocked',
      '1'
    );

    router.replace('/');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">
        Setting up your app...
      </div>
    </main>
  );
}
