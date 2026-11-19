import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import type { SettingsSection } from '@/types/settings';

export const SETTINGS_HREF = '/settings';

export function getSettingsSectionHref(section: SettingsSection): string {
  return `${SETTINGS_HREF}/${SETTINGS_SECTION_META[section].slug}`;
}
