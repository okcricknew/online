'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MpinSetupComplete() {
  const router = useRouter();

  useEffect(() => {
    // Current browser/app session ko unlocked mark karo
    sessionStorage.setItem(
      'laksh365_mpin_unlocked',
      '1'
    );

    // Setup complete hone ke baad direct dashboard
    router.replace('/');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">
        Opening app...
      </div>
    </main>
  );
}
