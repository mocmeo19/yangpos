import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant =
  'primary' | 'dark' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

const BASE_CLASS =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] select-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-sm hover:bg-brand-dark',
  dark: 'bg-ink text-white shadow-sm hover:bg-ink/85',
  secondary:
    'border border-line bg-surface text-ink shadow-card hover:border-line-strong hover:bg-surface-muted',
  ghost: 'text-ink-soft hover:bg-ink/5 hover:text-ink',
  danger: 'bg-danger text-white shadow-sm hover:bg-danger/90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'size-11',
  'icon-sm': 'size-9',
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Dùng cho phần tử không phải `<button>` (vd `Link`) cần giao diện giống nút. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    BASE_CLASS,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
