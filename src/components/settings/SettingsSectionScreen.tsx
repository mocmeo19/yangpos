'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { LoadingState } from '@/components/ui/LoadingState';
import { useSettings } from '@/hooks/use-settings';
import { describeSettingsStatus } from '@/lib/settings/describe-settings-status';
import { SETTINGS_HREF } from '@/lib/settings/get-settings-section-href';
import type { SettingsSection } from '@/types/settings';
import { SettingsNav } from './SettingsNav';
import { SettingsSectionForm } from './SettingsSectionForm';

/** Trang con của một mục cài đặt: menu các mục bên trái trên màn hình lớn, nút quay lại trên điện thoại. */
export function SettingsSectionScreen({
  section,
}: {
  section: SettingsSection;
}) {
  const { settings, isLoaded } = useSettings();

  // Chờ đọc xong cài đặt để bản nháp của form bắt đầu từ dữ liệu đã lưu, không phải mặc định.
  if (!isLoaded) {
    return <LoadingState />;
  }

  const statuses = describeSettingsStatus(settings);

  return (
    <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start lg:gap-8">
      <SettingsNav statuses={statuses} activeSection={section} />
      <div className="flex max-w-4xl min-w-0 flex-col gap-3">
        <Link
          href={SETTINGS_HREF}
          className="-ml-1 inline-flex items-center gap-1 self-start rounded-lg px-1 py-1 text-sm font-semibold text-ink-soft transition-colors hover:text-ink lg:hidden"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Cài đặt
        </Link>
        <SettingsSectionForm section={section} status={statuses[section]} />
      </div>
    </div>
  );
}
