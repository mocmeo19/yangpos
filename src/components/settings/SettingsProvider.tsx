'use client';

import { useMemo, type ReactNode } from 'react';
import { API_PATHS } from '@/api-client/api-paths';
import { SettingsContext } from '@/contexts/settings-context';
import { useApiQuery } from '@/hooks/use-api-query';
import { mergeWithDefaultSettings } from '@/lib/merge-settings';
import type { AppSettings, SettingsState } from '@/types/settings';

/** Đọc cài đặt một lần cho toàn ứng dụng và tự cập nhật khi người dùng lưu thay đổi. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const stored = useApiQuery<Partial<AppSettings>>(API_PATHS.settings);

  const state = useMemo<SettingsState>(
    () => ({
      settings: mergeWithDefaultSettings(stored),
      isLoaded: stored !== undefined,
    }),
    [stored],
  );

  return <SettingsContext value={state}>{children}</SettingsContext>;
}
