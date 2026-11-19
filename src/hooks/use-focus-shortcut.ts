'use client';

import { useEffect, type RefObject } from 'react';
import { isTypingTarget } from '@/lib/dom/is-typing-target';

/** Nhấn phím tắt (vd "/") khi không gõ ở ô nào để focus nhanh vào phần tử, giống thói quen trên Gmail. */
export function useFocusShortcut(
  targetRef: RefObject<HTMLElement | null>,
  shortcutKey: string | undefined,
) {
  useEffect(() => {
    if (!shortcutKey) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const hasModifier = event.metaKey || event.ctrlKey || event.altKey;
      if (
        event.key !== shortcutKey ||
        hasModifier ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      event.preventDefault();
      targetRef.current?.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey, targetRef]);
}
