import { Info, TriangleExclamationPoint, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SettingsNoteTone = 'info' | 'warning';

const TONE_CLASSES: Record<SettingsNoteTone, string> = {
  info: 'border-line bg-surface-muted text-ink-soft',
  warning: 'border-warning/25 bg-warning-soft text-warning',
};

const TONE_ICONS: Record<SettingsNoteTone, LucideIcon> = {
  info: Info,
  warning: TriangleExclamationPoint,
};

interface SettingsNoteProps {
  tone?: SettingsNoteTone;
  title?: string;
  children: ReactNode;
}

export function SettingsNote({
  tone = 'info',
  title,
  children,
}: SettingsNoteProps) {
  const Icon = TONE_ICONS[tone];

  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed',
        TONE_CLASSES[tone],
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold text-ink">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
