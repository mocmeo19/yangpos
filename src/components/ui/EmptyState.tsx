import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line-strong bg-surface/60 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface text-ink-faint shadow-card">
        <Icon className="size-7" strokeWidth={1.5} />
      </span>
      <div className="max-w-sm">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
