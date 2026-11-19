'use client';

import { useEffect, useEffectEvent } from 'react';
import { isTypingTarget } from '@/lib/dom/is-typing-target';
import { toKeypadKey } from '@/lib/keypad/to-keypad-key';
import type { KeypadKey } from '@/types/keypad';

/** Cho gõ số bằng bàn phím thật (cả cụm phím số) song song với bàn phím trên màn hình. */
export function useKeypadKeyboard(onKey: (key: KeypadKey) => void) {
  const handleKey = useEffectEvent(onKey);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
      if (
        event.defaultPrevented ||
        hasModifier ||
        event.isComposing ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      const key = toKeypadKey(event.key);
      if (!key) {
        return;
      }
      event.preventDefault();
      handleKey(key);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
