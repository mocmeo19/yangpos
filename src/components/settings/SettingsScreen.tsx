'use client';

import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SETTINGS_SECTION_GROUPS } from '@/data/settings-section-groups';
import { useSettings } from '@/hooks/use-settings';
import { describeSettingsStatus } from '@/lib/settings/describe-settings-status';
import { SettingsSectionLink } from './SettingsSectionLink';

/** Trang Cài đặt liệt kê các mục theo nhóm; mỗi mục mở một trang con riêng. */
export function SettingsScreen() {
  const { settings, isLoaded } = useSettings();

  // Chờ đọc xong cài đặt để trạng thái từng mục đúng với dữ liệu đã lưu, không phải mặc định.
  if (!isLoaded) {
    return <LoadingState />;
  }

  const statuses = describeSettingsStatus(settings);

  return (
    <>
      <PageHeader
        title="Cài đặt"
        description="Thông tin cửa hàng, thanh toán và thiết bị bán hàng."
      />
      <div className="flex max-w-5xl flex-col gap-6">
        {SETTINGS_SECTION_GROUPS.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
              {group.title}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.sections.map((section) => (
                <li key={section}>
                  <SettingsSectionLink
                    section={section}
                    status={statuses[section]}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
