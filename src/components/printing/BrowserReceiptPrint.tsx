'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReceiptView } from '@/components/receipt/ReceiptView';
import type { Receipt } from '@/types/receipt';
import type { PaperWidth } from '@/types/settings';

// Máy in nhiệt chỉ in được phần giữa cuộn giấy, mỗi bên chừa khoảng 4–5 mm.
const PRINTABLE_WIDTH_MM: Record<PaperWidth, number> = { 58: 48, 80: 72 };

interface BrowserReceiptPrintProps {
  receipt: Receipt;
  paperWidth: PaperWidth;
  copies: number;
  onDone: () => void;
}

/**
 * Gắn hóa đơn vào cuối trang, mở hộp thoại in của trình duyệt rồi báo xong để gỡ ra. Khổ trang
 * để driver máy in quyết định vì CSS không đặt được giấy cuộn dài tùy ý.
 */
export function BrowserReceiptPrint({
  receipt,
  paperWidth,
  copies,
  onDone,
}: BrowserReceiptPrintProps) {
  useEffect(() => {
    // Đợi một khung hình để trình duyệt dựng xong hóa đơn trước khi mở hộp thoại in.
    const frame = requestAnimationFrame(() => {
      window.print();
      onDone();
    });
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return createPortal(
    <div className="receipt-print-root">
      <style>{'@page { margin: 0; }'}</style>
      {Array.from({ length: copies }, (_, copyIndex) => (
        <div
          key={copyIndex}
          className="receipt-print-copy"
          style={{ width: `${PRINTABLE_WIDTH_MM[paperWidth]}mm` }}
        >
          <ReceiptView receipt={receipt} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
