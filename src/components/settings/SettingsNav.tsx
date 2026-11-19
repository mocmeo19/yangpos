'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { SETTINGS_SECTION_GROUPS } from '@/data/settings-section-groups';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { cn } from '@/lib/cn';
import {
  getSettingsSectionHref,
  SETTINGS_HREF,
} from '@/lib/settings/get-settings-section-href';
import type { SettingsSection } from '@/types/settings';
import type { SettingsStatus } from '@/types/settings-status';
import { SETTINGS_STATUS_DOT_CLASSES } from './settings-status-styles';

interface SettingsNavProps {
  statuses: Record<SettingsSection, SettingsStatus>;
  activeSection: SettingsSection;
}

/** Menu dính bên trái trên màn hình lớn để chuyển nhanh giữa các trang con của Cài đặt. */
export function SettingsNav({ statuses, activeSection }: SettingsNavProps) {
  return (
    <nav
      aria-label="Các mục cài đặt"
      className="sticky top-6 hidden flex-col gap-5 lg:flex"
    >
      <Link
        href={SETTINGS_HREF}
        className="inline-flex items-center gap-1 self-start rounded-lg px-2 py-1 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface/70 hover:text-ink"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        Tất cả cài đặt
      </Link>
      {SETTINGS_SECTION_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-3 text-xs font-semibold tracking-wide text-ink-faint uppercase">
            {group.title}
          </p>
          <ul className="flex flex-col gap-1">
            {group.sections.map((section) => {
              const meta = SETTINGS_SECTION_META[section];
              const status = statuses[section];
              const isActive = section === activeSection;
              const Icon = meta.icon;
              return (
                <li key={section}>
                  <Link
                    href={getSettingsSectionHref(section)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-surface text-ink shadow-card'
                        : 'text-ink-soft hover:bg-surface/70 hover:text-ink',
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {meta.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        SETTINGS_STATUS_DOT_CLASSES[status.tone],
                      )}
                    />
                    <span className="sr-only">({status.label})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
