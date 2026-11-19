'use client';

import {
  CircleAlert,
  CircleCheck,
  Info,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import type { Toast, ToastTone } from '@/types/toast';

interface ToneStyle {
  icon: LucideIcon;
  iconClassName: string;
}

const TONE_STYLES: Record<ToastTone, ToneStyle> = {
  success: { icon: CircleCheck, iconClassName: 'text-success' },
  error: { icon: CircleAlert, iconClassName: 'text-danger' },
  info: { icon: Info, iconClassName: 'text-brand' },
};

interface ToastViewportProps {
  toasts: readonly Toast[];
  onDismiss: (id: number) => void;
}

/**
 * Hiển thị qua popover để toast nằm trong top layer của trình duyệt, nhờ vậy không bị lớp nền của
 * hộp thoại đang mở che mất.
 */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const isOpen = viewport.matches(':popover-open');
    if (toasts.length > 0 && !isOpen) {
      viewport.showPopover();
    }
    if (toasts.length === 0 && isOpen) {
      viewport.hidePopover();
    }
  }, [toasts]);

  return (
    <div
      ref={viewportRef}
      popover="manual"
      className="inset-x-4 top-[calc(4rem+env(safe-area-inset-top))] bottom-auto m-0 w-auto overflow-visible border-0 bg-transparent p-0 lg:top-5"
    >
      <ol className="flex flex-col items-center gap-2">
        {toasts.map((toast) => {
          const { icon: Icon, iconClassName } = TONE_STYLES[toast.tone];
          return (
            <li
              key={toast.id}
              role={toast.tone === 'error' ? 'alert' : 'status'}
              className="flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface py-3 pr-2 pl-3.5 text-sm text-ink shadow-overlay motion-safe:animate-toast-in"
            >
              <Icon
                aria-hidden="true"
                className={cn('mt-0.5 size-5 shrink-0', iconClassName)}
              />
              <div className="min-w-0 flex-1 py-0.5">
                <p className="font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-ink-soft">{toast.description}</p>
                )}
              </div>
              {toast.action && (
                <Link
                  href={toast.action.href}
                  onClick={() => onDismiss(toast.id)}
                  className="shrink-0 self-center rounded-lg px-2.5 py-1.5 font-semibold text-brand transition-colors hover:bg-brand-soft"
                >
                  {toast.action.label}
                </Link>
              )}
              <button
                type="button"
                aria-label="Đóng thông báo"
                onClick={() => onDismiss(toast.id)}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
