'use client';

import { LockOpen } from 'lucide-react';
import { NumberKeypad } from '@/components/ui/NumberKeypad';
import { useKeypadKeyboard } from '@/hooks/use-keypad-keyboard';
import { formatAmountInput } from '@/lib/amount-input';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { suggestCashAmounts } from '@/lib/suggest-cash-amounts';
import type { KeypadEntry, KeypadKey } from '@/types/keypad';

interface CashPaymentPanelProps {
  total: number;
  entry: KeypadEntry;
  onKey: (key: KeypadKey) => void;
  onSuggestionSelect: (amount: number) => void;
  /** Nhắc trước khi két sẽ tự bật ra lúc xác nhận để thu ngân không bất ngờ. */
  opensCashDrawer: boolean;
}

export function CashPaymentPanel({
  total,
  entry,
  onKey,
  onSuggestionSelect,
  opensCashDrawer,
}: CashPaymentPanelProps) {
  const change = entry.amount - total;
  const isShort = change < 0;
  useKeypadKeyboard(onKey);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-line bg-surface px-4 py-3 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <span id="cash-received-label" className="text-sm font-semibold">
            Tiền khách đưa
          </span>
          <output
            aria-labelledby="cash-received-label"
            aria-live="polite"
            className="flex min-w-0 items-center font-mono text-2xl font-semibold tabular-nums sm:text-3xl"
          >
            <span
              className={cn(
                'truncate rounded-md px-1',
                entry.replaceOnNextDigit && 'bg-brand-soft text-brand-dark',
              )}
            >
              {formatCurrency(entry.amount)}
            </span>
            {!entry.replaceOnNextDigit && (
              <span
                aria-hidden="true"
                className="ml-0.5 h-7 w-0.5 shrink-0 rounded-full bg-brand motion-safe:animate-caret-blink"
              />
            )}
          </output>
        </div>
        <p
          className={cn(
            'mt-2 flex items-baseline justify-between gap-3 border-t border-dashed border-line-strong pt-2 text-sm font-semibold',
            isShort ? 'text-danger' : 'text-success',
          )}
        >
          <span>{isShort ? 'Khách đưa còn thiếu' : 'Tiền thừa trả khách'}</span>
          <span className="font-mono text-base tabular-nums">
            {formatCurrency(Math.abs(change))}
          </span>
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8.5rem]">
        <div
          role="group"
          aria-label="Số tiền gợi ý"
          className="grid grid-cols-4 content-start gap-2 sm:col-start-2 sm:row-start-1 sm:grid-cols-1"
        >
          {suggestCashAmounts(total).map((amount) => {
            const isSelected =
              entry.replaceOnNextDigit && amount === entry.amount;
            return (
              <button
                key={amount}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSuggestionSelect(amount)}
                className={cn(
                  'h-10 touch-manipulation rounded-xl border px-1 text-sm font-semibold tabular-nums transition-colors select-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none sm:h-14 sm:text-base',
                  isSelected
                    ? 'border-brand bg-brand-soft text-brand-dark'
                    : 'border-line bg-surface-muted text-ink hover:bg-surface',
                )}
              >
                {formatAmountInput(amount)}
              </button>
            );
          })}
        </div>
        <NumberKeypad
          label="Bàn phím số nhập tiền khách đưa"
          onKey={onKey}
          className="sm:col-start-1 sm:row-start-1"
        />
      </div>

      {opensCashDrawer && (
        <p className="flex items-center gap-2 text-xs text-ink-soft">
          <LockOpen aria-hidden="true" className="size-3.5" />
          Két tiền sẽ tự mở khi bấm xác nhận.
        </p>
      )}
    </div>
  );
}
