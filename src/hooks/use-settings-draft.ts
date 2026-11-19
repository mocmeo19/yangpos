'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/lib/get-error-message';
import { areSettingsEqual } from '@/lib/settings/are-settings-equal';
import { saveSettingsSection } from '@/api-client/settings-api';
import type { AppSettings, SettingsSection } from '@/types/settings';
import type { SettingsDraftState } from '@/types/settings-draft';
import { useSettings } from './use-settings';
import { useToast } from './use-toast';

interface SettingsDraftOptions<K extends SettingsSection> {
  successMessage: string;
  /** Chuẩn hóa dữ liệu trước khi lưu; ném lỗi kèm thông báo khi dữ liệu chưa hợp lệ. */
  prepare?: (value: AppSettings[K]) => AppSettings[K];
}

/**
 * Bản nháp của một phần cài đặt: chỉnh thoải mái rồi mới lưu. Nếu phần đã lưu đổi từ nơi khác
 * (vd tab khác) khi người dùng chưa sửa gì thì bản nháp cập nhật theo.
 */
export function useSettingsDraft<K extends SettingsSection>(
  section: K,
  { successMessage, prepare }: SettingsDraftOptions<K>,
): SettingsDraftState<AppSettings[K]> {
  const { settings } = useSettings();
  const showToast = useToast();
  const saved = settings[section];
  const [draft, setDraft] = useState(saved);
  const [baseline, setBaseline] = useState(saved);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!areSettingsEqual(baseline, saved)) {
    setBaseline(saved);
    if (areSettingsEqual(draft, baseline)) {
      setDraft(saved);
    }
  }

  function update(changes: Partial<AppSettings[K]>) {
    setDraft((current) => ({ ...current, ...changes }));
    setError(null);
  }

  function reset() {
    setDraft(saved);
    setError(null);
  }

  async function save() {
    setIsSaving(true);
    setError(null);
    try {
      const value = prepare ? prepare(draft) : draft;
      await saveSettingsSection(section, value);
      setDraft(value);
      showToast({ title: successMessage });
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    draft,
    update,
    reset,
    save,
    isDirty: !areSettingsEqual(draft, saved),
    isSaving,
    error,
  };
}
