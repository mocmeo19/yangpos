import { formatFullDateTime } from '@/lib/format-time';
import type { Receipt, ReceiptEInvoice } from '@/types/receipt';

interface ReceiptEInvoiceHeadingProps {
  receipt: Receipt;
  eInvoice: ReceiptEInvoice;
}

function ReceiptTextLines({ lines }: { lines: readonly string[] }) {
  return (
    <div className="mt-1">
      {lines.map((line, index) => (
        <p key={`${index}-${line}`}>{line}</p>
      ))}
    </div>
  );
}

/** Đầu bản thể hiện hóa đơn điện tử: tên hóa đơn, ký hiệu, số, ngày lập, người bán và người mua. */
export function ReceiptEInvoiceHeading({
  receipt,
  eInvoice,
}: ReceiptEInvoiceHeadingProps) {
  return (
    <>
      <div className="text-center">
        <p className="text-[14px] font-bold">{eInvoice.heading}</p>
        <p className="italic">{eInvoice.originNote}</p>
      </div>
      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3">
        <dt>Ký hiệu: {eInvoice.symbol}</dt>
        <dd className="text-right">Số: {eInvoice.number}</dd>
        <dt>Ngày lập</dt>
        <dd className="text-right">{formatFullDateTime(eInvoice.issuedAt)}</dd>
      </dl>
      <ReceiptTextLines lines={eInvoice.sellerLines} />
      <ReceiptTextLines lines={eInvoice.buyerLines} />
      <p className="mt-1 flex justify-between gap-3">
        <span>Đơn {receipt.orderLabel}</span>
        <span>{receipt.tableName}</span>
      </p>
    </>
  );
}
