import type { ReactNode } from 'react';

export const INPUT_CLASS_NAME =
  'h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink shadow-card outline-none transition placeholder:text-ink-faint focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:opacity-60';

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, htmlFor, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
