import { cn } from '@/lib/cn';
import type { SettingsStatus } from '@/types/settings-status';
import {
  SETTINGS_STATUS_BADGE_CLASSES,
  SETTINGS_STATUS_DOT_CLASSES,
} from './settings-status-styles';

export function SettingsStatusBadge({ status }: { status: SettingsStatus }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        SETTINGS_STATUS_BADGE_CLASSES[status.tone],
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          SETTINGS_STATUS_DOT_CLASSES[status.tone],
        )}
      />
      <span className="truncate">{status.label}</span>
    </span>
  );
}
