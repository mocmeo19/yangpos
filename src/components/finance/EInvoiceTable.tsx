import { EInvoiceStatusBadge } from '@/components/einvoice/EInvoiceStatusBadge';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { formatCurrency } from '@/lib/format-currency';
import { formatFullDateTime } from '@/lib/format-time';
import type { EInvoice } from '@/types/einvoice';

const AMOUNT_CELL_CLASS =
  'px-3 py-3 text-right font-mono whitespace-nowrap tabular-nums';

interface EInvoiceTableProps {
  invoices: readonly EInvoice[];
  onSelect: (invoice: EInvoice) => void;
}

export function EInvoiceTable({ invoices, onSelect }: EInvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold text-ink-soft">
            <tr>
              <th scope="col" className="px-4 py-3">
                Số hóa đơn
              </th>
              <th scope="col" className="px-3 py-3">
                Ngày lập
              </th>
              <th scope="col" className="px-3 py-3">
                Người mua
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                Thuế GTGT
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                Tổng tiền
              </th>
              <th scope="col" className="px-4 py-3">
                Gửi CQT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="transition-colors hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(invoice)}
                    className="group rounded-md text-left focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
                  >
                    <span className="block font-mono font-semibold text-brand group-hover:underline">
                      {formatEInvoiceNumber(invoice.number)}
                    </span>
                    <span className="block font-mono text-xs text-ink-soft">
                      {invoice.template}
                      {invoice.series}
                    </span>
                  </button>
                </td>
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap text-ink-soft">
                  {formatFullDateTime(invoice.issuedAt)}
                </td>
                <td className="max-w-[240px] truncate px-3 py-3">
                  {invoice.buyer?.name ?? 'Khách lẻ'}
                </td>
                <td className={AMOUNT_CELL_CLASS}>
                  {formatCurrency(invoice.totalVat)}
                </td>
                <td className={`${AMOUNT_CELL_CLASS} font-semibold`}>
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <EInvoiceStatusBadge status={invoice.transmission.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
