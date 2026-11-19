import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AmountTone } from '@/types/amount-tone';

const VALUE_TONE_CLASSES: Record<AmountTone, string> = {
  neutral: 'text-ink',
  positive: 'text-success',
  negative: 'text-danger',
};

interface FinanceMetricProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: AmountTone;
}

export function FinanceMetric({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'neutral',
}: FinanceMetricProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-ink-soft">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          'text-lg font-bold tracking-tight break-words tabular-nums sm:text-xl xl:text-2xl',
          VALUE_TONE_CLASSES[tone],
        )}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
