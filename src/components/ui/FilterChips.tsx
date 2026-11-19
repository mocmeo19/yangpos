import { cn } from '@/lib/cn';

export interface FilterChipOption<TValue extends string> {
  value: TValue;
  label: string;
  count?: number;
  dotClassName?: string;
}

interface FilterChipsProps<TValue extends string> {
  label: string;
  options: readonly FilterChipOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
}

export function FilterChips<TValue extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('scrollbar-none flex gap-2 overflow-x-auto', className)}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors',
              isSelected
                ? 'border-ink bg-ink text-white'
                : 'border-line bg-surface text-ink-soft shadow-card hover:border-line-strong hover:text-ink',
            )}
          >
            {option.dotClassName && (
              <span
                aria-hidden="true"
                className={cn('size-2 rounded-full', option.dotClassName)}
              />
            )}
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  'min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums',
                  isSelected ? 'bg-white/20' : 'bg-ink/5',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
