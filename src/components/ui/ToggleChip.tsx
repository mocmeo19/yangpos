import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface ToggleChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'aria-pressed'
> {
  isPressed: boolean;
}

export function ToggleChip({
  isPressed,
  className,
  ...props
}: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isPressed}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none disabled:pointer-events-none',
        isPressed
          ? 'border-brand bg-brand-soft text-brand-dark'
          : 'border-line bg-surface text-ink-soft hover:text-ink',
        className,
      )}
      {...props}
    />
  );
}
