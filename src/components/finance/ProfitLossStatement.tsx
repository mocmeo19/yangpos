import { cn } from '@/lib/cn';
import { toAmountTone } from '@/lib/finance/to-amount-tone';
import { formatCurrency } from '@/lib/format-currency';
import type { AmountTone } from '@/types/amount-tone';
import type { ProfitLoss } from '@/types/profit-loss';

type StatementRowKind = 'line' | 'detail' | 'subtotal' | 'total';

const ROW_CLASSES: Record<StatementRowKind, string> = {
  line: 'py-2.5',
  detail: 'py-1.5 pl-4 text-ink-soft',
  subtotal: 'border-t border-line py-2.5 font-semibold',
  total: 'mt-1 border-t-2 border-ink/15 pt-3 text-base font-bold',
};

const TOTAL_TONE_CLASSES: Record<AmountTone, string> = {
  neutral: '',
  positive: 'text-success',
  negative: 'text-danger',
};

interface StatementRowProps {
  label: string;
  amount: number;
  kind?: StatementRowKind;
  /** Khoản bị trừ, hiện dấu trừ phía trước cho dễ đọc như báo cáo giấy. */
  isDeduction?: boolean;
  className?: string;
}

function StatementRow({
  label,
  amount,
  kind = 'line',
  isDeduction = false,
  className,
}: StatementRowProps) {
  const formatted = formatCurrency(amount);
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4',
        ROW_CLASSES[kind],
        className,
      )}
    >
      <dt className="min-w-0">{label}</dt>
      <dd className="shrink-0 font-mono tabular-nums">
        {isDeduction && amount > 0 ? `−${formatted}` : formatted}
      </dd>
    </div>
  );
}

interface ProfitLossStatementProps {
  profitLoss: ProfitLoss;
  periodLabel: string;
}

export function ProfitLossStatement({
  profitLoss,
  periodLabel,
}: ProfitLossStatementProps) {
  const { expenses } = profitLoss;

  return (
    <section
      aria-labelledby="profit-loss-title"
      className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5"
    >
      <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="profit-loss-title" className="font-semibold">
          Kết quả kinh doanh
        </h2>
        <p className="text-xs text-ink-soft">{periodLabel}</p>
      </header>
      <dl className="text-sm">
        <StatementRow
          label="Doanh thu bán hàng (đã gồm thuế)"
          amount={profitLoss.grossRevenue}
        />
        <StatementRow
          label="Thuế GTGT đầu ra trên hóa đơn"
          amount={profitLoss.outputVat}
          isDeduction
        />
        <StatementRow
          label="Doanh thu thuần"
          amount={profitLoss.netRevenue}
          kind="subtotal"
        />
        <StatementRow label="Thu nhập khác" amount={profitLoss.otherIncome} />
        <StatementRow
          label="Chi phí"
          amount={profitLoss.totalExpenses}
          isDeduction
        />
        {expenses.map((expense) => (
          <StatementRow
            key={expense.categoryId}
            label={expense.label}
            amount={expense.amount}
            kind="detail"
          />
        ))}
        <StatementRow
          label="Lợi nhuận"
          amount={profitLoss.profit}
          kind="total"
          className={TOTAL_TONE_CLASSES[toAmountTone(profitLoss.profit)]}
        />
      </dl>
      {expenses.length === 0 && (
        <p className="mt-3 text-xs text-ink-soft">
          Chưa có phiếu chi trong kỳ. Lập phiếu chi ở tab Sổ quỹ để lợi nhuận
          phản ánh đúng chi phí.
        </p>
      )}
    </section>
  );
}
