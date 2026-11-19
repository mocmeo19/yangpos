import { Fragment } from 'react';
import { EINVOICE_SANDBOX_NOTICE } from '@/data/einvoice-labels';
import { VAT_RATE_SHORT_LABELS } from '@/data/vat-rates';
import { formatInvoiceDate } from '@/lib/einvoice/format-invoice-date';
import { formatCurrency } from '@/lib/format-currency';
import { PAYMENT_METHOD_LABELS } from '@/lib/payment-methods';
import { buildReceiptEInvoice } from '@/lib/receipt/build-receipt-einvoice';
import type { EInvoice } from '@/types/einvoice';
import { EInvoiceStatusBadge } from './EInvoiceStatusBadge';

interface EInvoiceDocumentProps {
  invoice: EInvoice;
  lookupUrl: string;
}

function PartyLines({ lines }: { lines: readonly string[] }) {
  return (
    <div className="rounded-xl border border-line p-3.5">
      {lines.map((line, index) => (
        <p key={`${index}-${line}`} className="text-sm">
          {line}
        </p>
      ))}
    </div>
  );
}

/** Hóa đơn trình bày trên màn hình, cùng nội dung với bản in nhưng có bảng hàng hóa đầy đủ. */
export function EInvoiceDocument({
  invoice,
  lookupUrl,
}: EInvoiceDocumentProps) {
  const display = buildReceiptEInvoice(invoice, lookupUrl);
  const isVatInvoice = invoice.template === '1';

  return (
    <article className="flex flex-col gap-4 text-sm">
      {invoice.isSandbox && (
        <p className="rounded-xl border border-warning/25 bg-warning-soft px-3.5 py-2.5 text-xs font-semibold text-warning">
          {EINVOICE_SANDBOX_NOTICE}
        </p>
      )}

      <header className="text-center">
        <p className="text-base font-bold tracking-wide">{display.heading}</p>
        <p className="text-xs text-ink-soft italic">{display.originNote}</p>
        <p className="mt-1 text-xs text-ink-soft">
          {formatInvoiceDate(invoice.issuedAt)}
        </p>
      </header>

      <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 rounded-xl bg-surface-muted p-3.5">
        <dt className="text-ink-soft">Ký hiệu</dt>
        <dd className="font-mono font-semibold">{display.symbol}</dd>
        <dt className="text-ink-soft">Số</dt>
        <dd className="font-mono font-semibold">{display.number}</dd>
        <dt className="text-ink-soft">Mã của CQT</dt>
        <dd className="font-mono break-all">
          {display.taxAuthorityCode || 'Chưa có'}
        </dd>
        {invoice.lookupCode && (
          <>
            <dt className="text-ink-soft">Mã tra cứu</dt>
            <dd className="font-mono font-semibold break-all">
              {invoice.lookupCode}
            </dd>
          </>
        )}
        <dt className="text-ink-soft">Gửi cơ quan thuế</dt>
        <dd>
          <EInvoiceStatusBadge status={invoice.transmission.status} />
        </dd>
      </dl>

      <div className="grid gap-3 sm:grid-cols-2">
        <PartyLines lines={display.sellerLines} />
        <PartyLines lines={display.buyerLines} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[540px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold text-ink-soft">
            <tr>
              <th scope="col" className="px-3 py-2.5">
                STT
              </th>
              <th scope="col" className="px-3 py-2.5">
                Tên hàng hóa, dịch vụ
              </th>
              <th scope="col" className="px-3 py-2.5">
                ĐVT
              </th>
              <th scope="col" className="px-3 py-2.5 text-right">
                SL
              </th>
              <th scope="col" className="px-3 py-2.5 text-right">
                Đơn giá
              </th>
              <th scope="col" className="px-3 py-2.5 text-right">
                Thành tiền
              </th>
              {isVatInvoice && (
                <th scope="col" className="px-3 py-2.5 text-right">
                  Thuế suất
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoice.lines.map((line, index) => (
              <tr key={`${line.name}-${line.unitPrice}`}>
                <td className="px-3 py-2.5 text-ink-soft">{index + 1}</td>
                <td className="px-3 py-2.5 font-medium">{line.name}</td>
                <td className="px-3 py-2.5">{line.unit}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {line.quantity}
                </td>
                <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">
                  {formatCurrency(line.unitPrice)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">
                  {formatCurrency(line.amount)}
                </td>
                {isVatInvoice && (
                  <td className="px-3 py-2.5 text-right">
                    {line.vatRate ? VAT_RATE_SHORT_LABELS[line.vatRate] : ''}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ml-auto grid w-full max-w-sm grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5">
        {display.summaryRows.map((row) => (
          <Fragment key={row.label}>
            <dt className="text-ink-soft">{row.label}</dt>
            <dd className="text-right font-mono tabular-nums">{row.value}</dd>
          </Fragment>
        ))}
        <dt className="font-semibold">Tổng tiền thanh toán</dt>
        <dd className="text-right font-mono font-bold tabular-nums">
          {formatCurrency(invoice.totalAmount)}
        </dd>
      </dl>

      <div className="flex flex-col gap-1 text-xs text-ink-soft">
        <p className="text-sm text-ink italic">
          Bằng chữ: {invoice.totalInWords}.
        </p>
        <p>
          Hình thức thanh toán: {PAYMENT_METHOD_LABELS[invoice.paymentMethod]}.
          Đơn giá đã gồm thuế GTGT.
        </p>
        <p>Tra cứu hóa đơn tại: {display.lookupSite}</p>
        {invoice.transmission.message && <p>{invoice.transmission.message}</p>}
      </div>
    </article>
  );
}
