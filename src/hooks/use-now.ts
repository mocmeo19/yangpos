'use client';

import { useEffect, useState } from 'react';

/** Thời điểm hiện tại, tự cập nhật theo chu kỳ để hiển thị đồng hồ và thời gian chờ. */
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
