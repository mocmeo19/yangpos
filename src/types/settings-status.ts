export type SettingsStatusTone = 'success' | 'warning' | 'neutral';

export interface SettingsStatus {
  tone: SettingsStatusTone;
  label: string;
}
