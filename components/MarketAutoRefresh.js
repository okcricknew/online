'use client';

import { useEffect } from 'react';

export default function MarketAutoRefresh({
  interval = 30000,
}) {
  useEffect(() => {
    const refresh = () => {
      window.location.reload();
    };

    const timer = window.setInterval(
      refresh,
      interval
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [interval]);

  return null;
}