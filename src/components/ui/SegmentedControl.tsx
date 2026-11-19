'use client';

import type { LucideIcon } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentedOption<TValue extends string> {
  value: TValue;
  label: string;
  icon?: LucideIcon;
  badge?: number;
}

interface SegmentedControlProps<TValue extends string> {
  label: string;
  options: readonly SegmentedOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
}

/** Dùng radio gốc của trình duyệt nên có sẵn điều hướng bằng phím mũi tên. */
export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<TValue>) {
  const groupName = useId();

  return (
    <fieldset className={cn('flex rounded-xl bg-ink/5 p-1', className)}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const isSelected = option.value === value;
        const Icon = option.icon;
        return (
          <label
            key={option.value}
            className={cn(
              'flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold whitespace-nowrap transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/60',
              isSelected
                ? 'bg-surface text-ink shadow-card'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {Icon && <Icon aria-hidden="true" className="size-4" />}
            {option.label}
            {option.badge !== undefined && (
              <span
                className={cn(
                  'min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums',
                  isSelected ? 'bg-brand text-white' : 'bg-ink/10',
                )}
              >
                {option.badge}
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}
