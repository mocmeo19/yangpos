'use client';

import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { ConfirmOptions } from '@/types/confirm';

interface ConfirmDialogProps {
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  options,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = options.tone === 'danger';

  return (
    <Modal
      title={options.title}
      description={options.description}
      size="sm"
      onClose={onCancel}
      footer={
        <>
          {/* Focus mặc định vào nút quay lại để lỡ nhấn Enter cũng không thực hiện thao tác nguy hiểm. */}
          <Button variant="secondary" onClick={onCancel} data-autofocus>
            {options.cancelLabel ?? 'Quay lại'}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm}>
            {options.confirmLabel ?? 'Đồng ý'}
          </Button>
        </>
      }
    >
      {isDanger && (
        <p className="flex items-center gap-2 rounded-xl bg-danger-soft px-3 py-2.5 text-sm font-medium text-danger">
          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
          Thao tác này không thể hoàn tác.
        </p>
      )}
    </Modal>
  );
}
