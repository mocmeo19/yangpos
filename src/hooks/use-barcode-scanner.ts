'use client';

import { useEffect, useEffectEvent } from 'react';
import { isTypingTarget } from '@/lib/dom/is-typing-target';
import type { ScannerSettings } from '@/types/settings';

/**
 * Nhận mã từ máy quét USB/Bluetooth ở chế độ bàn phím (HID). Máy quét "gõ" từng ký tự rất nhanh
 * rồi kết thúc bằng Enter hoặc Tab, nên phân biệt với người gõ tay dựa vào khoảng cách giữa hai
 * phím. Khi con trỏ đang ở ô nhập liệu thì để ký tự đi vào ô đó như bình thường.
 */
export function useBarcodeScanner(
  settings: ScannerSettings,
  onScan: (code: string) => void,
) {
  const handleScan = useEffectEvent(onScan);
  const { enabled, terminator, maxKeyIntervalMs, minLength } = settings;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let buffer = '';
    let lastKeyAt = Number.NEGATIVE_INFINITY;

    function handleKeyDown(event: KeyboardEvent) {
      // Máy quét giữ Shift để gõ chữ in hoa, phím này không phải một ký tự của mã.
      if (event.key === 'Shift') {
        return;
      }
      const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
      if (
        hasModifier ||
        event.isComposing ||
        event.repeat ||
        isTypingTarget(event.target)
      ) {
        buffer = '';
        return;
      }

      const isFastSequence = event.timeStamp - lastKeyAt <= maxKeyIntervalMs;
      lastKeyAt = event.timeStamp;

      if (event.key === terminator) {
        if (isFastSequence && buffer.length >= minLength) {
          // Chặn Enter/Tab để không bấm nhầm nút hay chuyển focus đang có.
          event.preventDefault();
          event.stopPropagation();
          handleScan(buffer);
        }
        buffer = '';
        return;
      }

      if (event.key.length !== 1) {
        buffer = '';
        return;
      }
      buffer = isFastSequence ? buffer + event.key : event.key;
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [enabled, terminator, maxKeyIntervalMs, minLength]);
}
