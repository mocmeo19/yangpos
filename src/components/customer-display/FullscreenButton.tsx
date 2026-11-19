'use client';

import { Maximize } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Trình duyệt chỉ cho vào toàn màn hình khi người dùng bấm, nên cần một nút; ẩn khi đã vào. */
export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncState = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    syncState();
    document.addEventListener('fullscreenchange', syncState);
    return () => document.removeEventListener('fullscreenchange', syncState);
  }, []);

  if (isFullscreen) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => void document.documentElement.requestFullscreen()}
      aria-label="Toàn màn hình"
      className="absolute top-6 right-6 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 p-2.5 text-sm font-semibold text-white opacity-60 backdrop-blur transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:px-4 sm:py-2"
    >
      <Maximize className="size-4" />
      <span className="hidden sm:inline">Toàn màn hình</span>
    </button>
  );
}
