import type { SettingsStatusTone } from '@/types/settings-status';

export const SETTINGS_STATUS_DOT_CLASSES: Record<SettingsStatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  neutral: 'bg-ink-faint',
};

export const SETTINGS_STATUS_BADGE_CLASSES: Record<SettingsStatusTone, string> =
  {
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    neutral: 'bg-ink/5 text-ink-soft',
  };
