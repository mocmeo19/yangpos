import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format-percent';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Phần trăm thay đổi so với kỳ trước; `null` khi kỳ trước chưa có số liệu. */
  change: number | null;
  comparisonLabel: string;
}

interface ChangeDisplay {
  icon: LucideIcon;
  text: string;
  className: string;
}

/** Mọi chỉ số trên trang đều "càng cao càng tốt" nên tăng hiển thị xanh, giảm hiển thị đỏ. */
function describeChange(change: number): ChangeDisplay {
  const rounded = Math.round(change);
  if (rounded > 0) {
    return {
      icon: ArrowUpRight,
      text: `+${formatPercent(rounded)}`,
      className: 'text-success',
    };
  }
  if (rounded < 0) {
    return {
      icon: ArrowDownRight,
      text: `−${formatPercent(Math.abs(rounded))}`,
      className: 'text-danger',
    };
  }
  return { icon: Minus, text: formatPercent(0), className: 'text-ink-soft' };
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  comparisonLabel,
}: StatCardProps) {
  const changeDisplay = change === null ? null : describeChange(change);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-soft">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      <p className="text-xl font-bold tracking-tight sm:text-2xl xl:text-[28px]">
        {value}
      </p>
      {changeDisplay ? (
        <p className="flex flex-wrap items-center gap-x-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold',
              changeDisplay.className,
            )}
          >
            <changeDisplay.icon aria-hidden="true" className="size-3.5" />
            {changeDisplay.text}
          </span>
          <span className="text-ink-faint">{comparisonLabel}</span>
        </p>
      ) : (
        <p className="text-xs text-ink-faint">Kỳ trước chưa có số liệu</p>
      )}
    </div>
  );
}
