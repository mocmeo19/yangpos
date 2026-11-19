import {
  SETTINGS_SECTION_META,
  SETTINGS_SECTION_ORDER,
} from '@/data/settings-sections';
import type { SettingsSection } from '@/types/settings';

export function findSettingsSectionBySlug(
  slug: string,
): SettingsSection | undefined {
  return SETTINGS_SECTION_ORDER.find(
    (section) => SETTINGS_SECTION_META[section].slug === slug,
  );
}
