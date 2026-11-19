import type { SettingsSection } from './settings';

export interface SettingsSectionGroup {
  title: string;
  sections: readonly SettingsSection[];
}
