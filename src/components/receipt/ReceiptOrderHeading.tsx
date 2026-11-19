import { formatDateTime } from '@/lib/format-time';
import type { Receipt } from '@/types/receipt';

/** Đầu phiếu thường: tên phiếu, số đơn, bàn và thời gian. */
export function ReceiptOrderHeading({ receipt }: { receipt: Receipt }) {
  return (
    <>
      <p className="text-center text-[14px] font-bold">{receipt.title}</p>
      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3">
        <dt>Số: {receipt.orderLabel}</dt>
        <dd className="text-right">{receipt.tableName}</dd>
        <dt>Giờ vào</dt>
        <dd className="text-right">{formatDateTime(receipt.createdAt)}</dd>
        <dt>In lúc</dt>
        <dd className="text-right">{formatDateTime(receipt.printedAt)}</dd>
      </dl>
    </>
  );
}
