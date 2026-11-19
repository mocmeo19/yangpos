'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { ChoiceCardOption } from '@/types/choice-card';

interface ChoiceCardsProps<TValue extends string> {
  label: string;
  options: readonly ChoiceCardOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}

/** Nhóm lựa chọn dạng thẻ có mô tả; dùng radio gốc nên điều hướng được bằng phím mũi tên. */
export function ChoiceCards<TValue extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceCardsProps<TValue>) {
  const groupName = useId();

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="grid gap-2 sm:auto-cols-fr sm:grid-flow-col">
        {options.map((option) => {
          const isSelected = option.value === value;
          const Icon = option.icon;
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer flex-col gap-1.5 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/60',
                isSelected
                  ? 'border-brand bg-brand-soft/60'
                  : 'border-line bg-surface hover:border-line-strong',
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
              <span
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold',
                  isSelected ? 'text-brand-dark' : 'text-ink',
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {option.label}
              </span>
              <span className="text-xs leading-relaxed text-ink-soft">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
