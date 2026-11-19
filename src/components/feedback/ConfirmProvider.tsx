'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ConfirmContext } from '@/contexts/confirm-context';
import type { ConfirmOptions } from '@/types/confirm';
import { ConfirmDialog } from './ConfirmDialog';

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

/** Thay `window.confirm` bằng hộp thoại cùng giao diện ứng dụng, trả về Promise để dùng với `await`. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const pendingRef = useRef<PendingConfirm | null>(null);

  const requestConfirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        // Yêu cầu mới thay thế yêu cầu cũ nên trả lời "không" cho yêu cầu cũ để nó không treo mãi.
        pendingRef.current?.resolve(false);
        const next: PendingConfirm = { options, resolve };
        pendingRef.current = next;
        setPending(next);
      }),
    [],
  );

  function settle(confirmed: boolean) {
    pendingRef.current?.resolve(confirmed);
    pendingRef.current = null;
    setPending(null);
  }

  return (
    <ConfirmContext value={requestConfirm}>
      {children}
      {pending && (
        <ConfirmDialog
          options={pending.options}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
        />
      )}
    </ConfirmContext>
  );
}
