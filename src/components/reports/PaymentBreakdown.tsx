import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { formatPercent } from '@/lib/format-percent';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '@/lib/payment-methods';
import type { PaymentMethod } from '@/types/order';

const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  cash: 'bg-series-1',
  transfer: 'bg-series-2',
  card: 'bg-series-3',
};

// Phần quá hẹp không đủ chỗ in tỷ lệ bên trong; con số vẫn có ở danh sách bên dưới.
const MIN_SHARE_FOR_INLINE_LABEL = 12;

interface PaymentBreakdownProps {
  totals: Record<PaymentMethod, number>;
  revenue: number;
}

export function PaymentBreakdown({ totals, revenue }: PaymentBreakdownProps) {
  const parts = PAYMENT_METHODS.map((method) => ({
    method,
    amount: totals[method],
    share: revenue > 0 ? (totals[method] / revenue) * 100 : 0,
  }));
  const barLabel = parts
    .map(
      (part) =>
        `${PAYMENT_METHOD_LABELS[part.method]} ${formatPercent(part.share)}`,
    )
    .join(', ');

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="font-bold">Theo hình thức thanh toán</h2>
      <p className="text-sm text-ink-soft">
        Tỷ trọng doanh thu của từng hình thức
      </p>
      {revenue === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Chưa có giao dịch.</p>
      ) : (
        <>
          <div
            role="img"
            aria-label={barLabel}
            className="mt-4 flex h-7 gap-0.5"
          >
            {parts
              .filter((part) => part.amount > 0)
              .map((part) => (
                <div
                  key={part.method}
                  title={`${PAYMENT_METHOD_LABELS[part.method]}: ${formatCurrency(part.amount)}`}
                  className={cn(
                    'flex min-w-1 items-center rounded-[4px] px-2 text-xs font-semibold text-white',
                    PAYMENT_METHOD_COLORS[part.method],
                  )}
                  style={{ flexGrow: part.share, flexBasis: 0 }}
                >
                  {part.share >= MIN_SHARE_FOR_INLINE_LABEL &&
                    formatPercent(part.share)}
                </div>
              ))}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {parts.map((part) => (
              <li
                key={part.method}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-2.5 rounded-[3px]',
                      PAYMENT_METHOD_COLORS[part.method],
                    )}
                  />
                  {PAYMENT_METHOD_LABELS[part.method]}
                </span>
                <span className="tabular-nums">
                  <span className="mr-3 text-ink-faint">
                    {formatPercent(part.share)}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(part.amount)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
