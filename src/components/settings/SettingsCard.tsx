'use client';

import { Undo2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import type { SettingsFormStatus } from '@/types/settings-draft';
import type { SettingsSectionMeta } from '@/types/settings-section-meta';
import type { SettingsStatus } from '@/types/settings-status';
import { SettingsStatusBadge } from './SettingsStatusBadge';

interface SettingsCardProps {
  meta: SettingsSectionMeta;
  status: SettingsStatus;
  form: SettingsFormStatus;
  /** Thao tác phụ như In thử, Mở két thử; nằm bên trái nút lưu. */
  actions?: ReactNode;
  children: ReactNode;
}

/** Khung chung của một phần cài đặt: tiêu đề, trạng thái, nội dung và thanh lưu ở cuối. */
export function SettingsCard({
  meta,
  status,
  form,
  actions,
  children,
}: SettingsCardProps) {
  const Icon = meta.icon;
  const titleId = `${meta.slug}-title`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.save();
  }

  // Mỗi mục cài đặt là một trang con nên tiêu đề khung chính là tiêu đề trang (h1).
  return (
    <section
      id={meta.slug}
      aria-labelledby={titleId}
      className="rounded-2xl border border-line bg-surface shadow-card"
    >
      <form onSubmit={handleSubmit} noValidate>
        <header className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1
                id={titleId}
                className="text-xl font-bold tracking-tight sm:text-2xl"
              >
                {meta.title}
              </h1>
              <SettingsStatusBadge status={status} />
            </div>
            <p className="mt-0.5 text-sm text-ink-soft">{meta.description}</p>
          </div>
        </header>

        <div className="flex flex-col gap-4 p-4 sm:p-5">{children}</div>

        {form.error && (
          <p
            role="alert"
            className="mx-4 mb-4 rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger sm:mx-5"
          >
            {form.error}
          </p>
        )}

        <footer className="flex flex-wrap items-center justify-end gap-2 rounded-b-2xl border-t border-line bg-surface-muted px-4 py-3 sm:px-5">
          {actions && (
            <div className="mr-auto flex flex-wrap gap-2">{actions}</div>
          )}
          {form.isDirty && (
            <>
              <span className="text-xs font-semibold text-warning">
                Chưa lưu
              </span>
              <Button variant="ghost" size="sm" onClick={form.reset}>
                <Undo2 className="size-4" />
                Hoàn tác
              </Button>
            </>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!form.isDirty || form.isSaving}
          >
            {form.isSaving ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </footer>
      </form>
    </section>
  );
}
