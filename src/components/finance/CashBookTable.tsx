'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/hooks/use-confirm';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/format-currency';
import { formatDate, formatFullDateTime } from '@/lib/format-time';
import { getErrorMessage } from '@/lib/get-error-message';
import { deleteCashEntry } from '@/api-client/cash-entry-api';
import type { CashBook, CashBookRow } from '@/types/cash-book';

const AMOUNT_CELL_CLASS =
  'px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums';

/** Dòng bán hàng gộp theo ngày nên chỉ ghi ngày; phiếu lập tay ghi cả giờ. */
function formatRowTime(row: CashBookRow): string {
  return row.entryId
    ? formatFullDateTime(row.occurredAt)
    : formatDate(row.occurredAt);
}

function formatOptionalAmount(amount: number): string {
  return amount > 0 ? formatCurrency(amount) : '';
}

export function CashBookTable({ book }: { book: CashBook }) {
  const confirm = useConfirm();
  const showToast = useToast();

  async function handleDelete(row: CashBookRow) {
    if (!row.entryId) {
      return;
    }
    const isConfirmed = await confirm({
      title: `Xóa phiếu ${row.reference}?`,
      description: 'Số phiếu đã cấp sẽ không được dùng lại.',
      confirmLabel: 'Xóa phiếu',
      cancelLabel: 'Giữ lại',
      tone: 'danger',
    });
    if (!isConfirmed) {
      return;
    }
    try {
      await deleteCashEntry(row.entryId);
      showToast({ title: `Đã xóa phiếu ${row.reference}` });
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Chưa xóa được phiếu',
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold text-ink-soft">
            <tr>
              <th scope="col" className="px-4 py-3">
                Thời gian
              </th>
              <th scope="col" className="px-3 py-3">
                Số phiếu
              </th>
              <th scope="col" className="px-3 py-3">
                Diễn giải
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                Thu
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                Chi
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                Tồn
              </th>
              <th scope="col" className="w-12 px-3 py-3">
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <tr className="bg-surface-muted/50">
              <td colSpan={5} className="px-4 py-2.5 font-semibold">
                Tồn đầu kỳ
              </td>
              <td className={AMOUNT_CELL_CLASS}>
                {formatCurrency(book.openingBalance)}
              </td>
              <td />
            </tr>
            {book.rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap text-ink-soft">
                  {formatRowTime(row)}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                  {row.reference}
                </td>
                <td className="px-3 py-2.5">{row.description}</td>
                <td className={`${AMOUNT_CELL_CLASS} text-success`}>
                  {formatOptionalAmount(row.receipt)}
                </td>
                <td className={`${AMOUNT_CELL_CLASS} text-danger`}>
                  {formatOptionalAmount(row.payment)}
                </td>
                <td className={`${AMOUNT_CELL_CLASS} font-semibold`}>
                  {formatCurrency(row.balance)}
                </td>
                <td className="px-3 py-1.5 text-right">
                  {row.entryId && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Xóa phiếu ${row.reference}`}
                      title="Xóa phiếu"
                      onClick={() => handleDelete(row)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {book.rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-ink-soft"
                >
                  Chưa có khoản thu chi nào trong kỳ.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-surface-muted font-semibold">
            <tr>
              <td colSpan={3} className="px-4 py-3">
                Cộng phát sinh · Tồn cuối kỳ
              </td>
              <td className={AMOUNT_CELL_CLASS}>
                {formatCurrency(book.totalReceipts)}
              </td>
              <td className={AMOUNT_CELL_CLASS}>
                {formatCurrency(book.totalPayments)}
              </td>
              <td className={AMOUNT_CELL_CLASS}>
                {formatCurrency(book.closingBalance)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
