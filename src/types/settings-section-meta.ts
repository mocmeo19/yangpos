import type { LucideIcon } from 'lucide-react';
import type { SettingsSection } from './settings';

export interface SettingsSectionMeta {
  section: SettingsSection;
  /** Đoạn cuối đường dẫn trang con của mục, vd "printer" trong /settings/printer. */
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
