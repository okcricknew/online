'use client';

import { useEffect } from 'react';

export default function MarketAutoRefresh({
  interval = 10000,
}) {
  useEffect(() => {
    const refresh = () => {
      /*
       * Next.js current page ko dobara server se
       * render karega.
       *
       * Isse:
       *
       * 06:00 → OPEN
       * 10:00 → CLOSE
       * 11:00 → CLOSED
       *
       * automatically update hoga.
       */
      window.location.reload();
    };

    const timer =
      window.setInterval(
        refresh,
        interval
      );

    return () => {
      window.clearInterval(timer);
    };
  }, [interval]);

  return null;
}
