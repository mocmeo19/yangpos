'use client';

import { QrCode as QrCodeIcon } from 'lucide-react';
import { QrCode } from '@/components/receipt/QrCode';
import { formatCurrency } from '@/lib/format-currency';
import { normalizeAccountNumber } from '@/lib/normalize-account-number';
import { calculateItemsTotal } from '@/lib/order-totals';
import { createSampleOrder } from '@/lib/receipt/create-sample-order';
import { buildTransferNote } from '@/lib/transfer-note';
import { buildVietQrPayload } from '@/lib/vietqr';
import type { BankTransferSettings } from '@/types/settings';

const QR_SIZE_PX = 168;
const SAMPLE_ORDER = createSampleOrder(0);
const SAMPLE_TOTAL = calculateItemsTotal(SAMPLE_ORDER.items);

/** Mã VietQR mẫu theo thông tin đang nhập để quét thử bằng app ngân hàng trước khi lưu. */
export function BankQrPreview({
  bankTransfer,
}: {
  bankTransfer: BankTransferSettings;
}) {
  const accountNumber = normalizeAccountNumber(bankTransfer.accountNumber);

  if (!bankTransfer.bankBin || !accountNumber) {
    return (
      <figure className="flex flex-col items-center gap-3 self-start rounded-xl border border-dashed border-line-strong bg-surface-muted p-4 text-center">
        <span className="grid size-44 place-items-center rounded-lg bg-surface text-ink-faint">
          <QrCodeIcon
            aria-hidden="true"
            className="size-12"
            strokeWidth={1.5}
          />
        </span>
        <figcaption className="text-xs text-ink-soft">
          Chọn ngân hàng và nhập số tài khoản để tạo mã VietQR.
        </figcaption>
      </figure>
    );
  }

  const note = buildTransferNote(bankTransfer.notePrefix, SAMPLE_ORDER.number);
  const payload = buildVietQrPayload({
    bankBin: bankTransfer.bankBin,
    accountNumber,
    amount: SAMPLE_TOTAL,
    note,
  });

  return (
    <figure className="flex flex-col items-center gap-3 self-start rounded-xl border border-line bg-surface-muted p-4 text-center">
      <div className="rounded-lg bg-white p-1 shadow-card">
        <QrCode
          payload={payload}
          size={QR_SIZE_PX}
          label={`Mã VietQR mẫu ${formatCurrency(SAMPLE_TOTAL)}`}
        />
      </div>
      <figcaption className="text-xs text-ink-soft">
        Mã mẫu {formatCurrency(SAMPLE_TOTAL)}, nội dung{' '}
        <span className="font-mono font-semibold text-ink">{note}</span>. Quét
        bằng app ngân hàng để kiểm tra đúng tên tài khoản, không cần chuyển
        tiền.
      </figcaption>
    </figure>
  );
}
