import { Landmark } from 'lucide-react';
import Link from 'next/link';
import { QrCode } from '@/components/receipt/QrCode';
import { buttonClassName } from '@/components/ui/Button';
import { findVietnamBank } from '@/lib/find-vietnam-bank';
import { formatCurrency } from '@/lib/format-currency';
import { isBankTransferReady } from '@/lib/is-bank-transfer-ready';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import { buildVietQrPayload } from '@/lib/vietqr';
import type { BankTransferSettings } from '@/types/settings';

const QR_SIZE_PX = 180;

interface TransferPaymentPanelProps {
  total: number;
  transferNote: string;
  bankTransfer: BankTransferSettings;
}

export function TransferPaymentPanel({
  total,
  transferNote,
  bankTransfer,
}: TransferPaymentPanelProps) {
  if (!isBankTransferReady(bankTransfer)) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line-strong bg-surface-muted px-4 py-3 text-sm text-ink-soft">
        <p>
          Chưa có tài khoản nhận tiền nên chưa tạo được mã VietQR. Nhắc khách
          ghi nội dung chuyển khoản:{' '}
          <strong className="font-mono text-ink">{transferNote}</strong>
        </p>
        <Link
          href={getSettingsSectionHref('bankTransfer')}
          className={buttonClassName({ variant: 'secondary', size: 'sm' })}
        >
          <Landmark className="size-4" />
          Thêm tài khoản nhận tiền
        </Link>
      </div>
    );
  }

  const bankName =
    findVietnamBank(bankTransfer.bankBin)?.shortName ?? bankTransfer.bankBin;
  const payload = buildVietQrPayload({
    bankBin: bankTransfer.bankBin,
    accountNumber: bankTransfer.accountNumber,
    amount: total,
    note: transferNote,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:flex-row">
        <div className="shrink-0 rounded-xl border border-line bg-white p-1">
          <QrCode
            payload={payload}
            size={QR_SIZE_PX}
            label={`Mã VietQR chuyển ${formatCurrency(total)} vào tài khoản ${bankName}`}
          />
        </div>
        <dl className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
          <dt className="text-ink-soft">Ngân hàng</dt>
          <dd className="text-right font-semibold">{bankName}</dd>
          <dt className="text-ink-soft">Số tài khoản</dt>
          <dd className="text-right font-mono font-semibold break-all">
            {bankTransfer.accountNumber}
          </dd>
          {bankTransfer.accountName && (
            <>
              <dt className="text-ink-soft">Chủ tài khoản</dt>
              <dd className="text-right font-semibold">
                {bankTransfer.accountName}
              </dd>
            </>
          )}
          <dt className="text-ink-soft">Số tiền</dt>
          <dd className="text-right font-mono font-semibold tabular-nums">
            {formatCurrency(total)}
          </dd>
          <dt className="text-ink-soft">Nội dung</dt>
          <dd className="text-right font-mono font-semibold">{transferNote}</dd>
        </dl>
      </div>
      <p className="text-xs text-ink-soft">
        Khách quét mã bằng ứng dụng ngân hàng, số tiền và nội dung đã điền sẵn.
        Chỉ bấm xác nhận khi đã thấy tiền về tài khoản.
      </p>
    </div>
  );
}
