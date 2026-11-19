'use client';

import { ScanLine } from 'lucide-react';
import { useState } from 'react';
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner';
import { useMenuItems } from '@/hooks/use-menu-items';
import { findMenuItemByBarcode } from '@/lib/find-menu-item-by-barcode';
import type { ScannerSettings } from '@/types/settings';

interface ScanResult {
  code: string;
  scannedAt: number;
}

/** Thử máy quét bằng cấu hình đang chỉnh, kể cả khi chưa bật, để kiểm tra trước khi dùng. */
export function ScannerTestPanel({ scanner }: { scanner: ScannerSettings }) {
  const menuItems = useMenuItems();
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  useBarcodeScanner({ ...scanner, enabled: true }, (code) =>
    setLastScan({ code, scannedAt: Date.now() }),
  );

  const matchedItem =
    lastScan && menuItems
      ? findMenuItemByBarcode(menuItems, lastScan.code)
      : undefined;

  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface-muted p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-brand shadow-card">
          <ScanLine aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Quét thử</p>
          <p className="text-xs text-ink-soft">
            Bấm vào chỗ trống trên trang rồi quét một mã bất kỳ.
          </p>
        </div>
      </div>
      <div aria-live="polite">
        {lastScan && (
          <div
            key={lastScan.scannedAt}
            className="mt-3 rounded-lg bg-surface p-3 shadow-card motion-safe:animate-fade-in"
          >
            <p className="font-mono text-lg font-semibold break-all">
              {lastScan.code}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">
              {lastScan.code.length} ký tự ·{' '}
              {matchedItem ? `Món ${matchedItem.name}` : 'Chưa gán cho món nào'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
