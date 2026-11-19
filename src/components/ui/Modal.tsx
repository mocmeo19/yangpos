'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ModalSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
};

interface ModalProps {
  title: string;
  description?: string;
  size?: ModalSize;
  /** Ẩn header mặc định khi nội dung đã có header riêng; tiêu đề vẫn dành cho trình đọc màn hình. */
  hideHeader?: boolean;
  padded?: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Mở ngay khi được mount, component cha điều khiển bằng render có điều kiện. Trên điện thoại hiển
 * thị dạng bottom sheet. Phần tử có thuộc tính `data-autofocus` nhận focus khi hộp thoại mở.
 */
export function Modal({
  title,
  description,
  size = 'md',
  hideHeader = false,
  padded = true,
  onClose,
  children,
  footer,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const hasVisibleDescription = Boolean(description) && !hideHeader;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={hasVisibleDescription ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className={cn(
        'mt-auto mb-0 max-h-[92dvh] w-full max-w-none flex-col overflow-hidden rounded-t-3xl bg-surface p-0 text-ink shadow-overlay open:flex motion-safe:animate-sheet-in',
        'sm:m-auto sm:w-[calc(100%-2rem)] sm:rounded-2xl sm:motion-safe:animate-dialog-in',
        SIZE_CLASSES[size],
      )}
    >
      <div aria-hidden="true" className="flex justify-center pt-2.5 sm:hidden">
        <span className="h-1 w-10 rounded-full bg-line-strong" />
      </div>

      {hideHeader ? (
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
      ) : (
        <header className="flex shrink-0 items-start justify-between gap-4 px-5 pt-3 pb-2 sm:pt-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-0.5 text-sm text-ink-soft">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </header>
      )}

      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto',
          padded && 'px-5 pt-2 pb-5',
        )}
      >
        {children}
      </div>

      {footer && (
        <footer className="flex shrink-0 gap-2 border-t border-line bg-surface-muted px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] *:flex-1 sm:justify-end sm:pb-4 sm:*:flex-none">
          {footer}
        </footer>
      )}
    </dialog>
  );
}
