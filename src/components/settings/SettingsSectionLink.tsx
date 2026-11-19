import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import type { SettingsSection } from '@/types/settings';
import type { SettingsStatus } from '@/types/settings-status';
import { SettingsStatusBadge } from './SettingsStatusBadge';

interface SettingsSectionLinkProps {
  section: SettingsSection;
  status: SettingsStatus;
}

/** Thẻ một mục trên trang Cài đặt, mở trang con của mục đó. */
export function SettingsSectionLink({
  section,
  status,
}: SettingsSectionLinkProps) {
  const meta = SETTINGS_SECTION_META[section];
  const Icon = meta.icon;

  return (
    <Link
      href={getSettingsSectionHref(section)}
      className="group flex h-full items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-raised focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold">{meta.title}</span>
          <SettingsStatusBadge status={status} />
        </span>
        <span className="mt-1 block text-sm text-ink-soft">
          {meta.description}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="mt-2.5 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
