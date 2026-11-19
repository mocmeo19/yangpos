'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { formatOrderNumber } from '@/lib/format-order-number';
import type { Order } from '@/types/order';

type PagerButtonState = 'selected' | 'busy' | 'free';

const PAGER_BUTTON_CLASSES: Record<PagerButtonState, string> = {
  selected: 'border-brand bg-brand text-white shadow-sm',
  busy: 'cursor-not-allowed border-dashed border-line bg-surface-muted text-ink-faint',
  free: 'border-line bg-surface text-ink hover:border-brand hover:bg-brand-soft/60',
};

interface PagerPickerDialogProps {
  pagerNumbers: readonly number[];
  pagersInUse: ReadonlyMap<number, Order>;
  value: number | null;
  /** Đơn đang đổi thẻ: thẻ của chính đơn này không bị coi là đang bận. */
  currentOrderId?: string;
  onSelect: (pagerNumber: number | null) => void;
  onClose: () => void;
}

/** Lưới số thẻ: thẻ đang ở trong tay khách khác bị khóa và ghi số đơn đang giữ. */
export function PagerPickerDialog({
  pagerNumbers,
  pagersInUse,
  value,
  currentOrderId,
  onSelect,
  onClose,
}: PagerPickerDialogProps) {
  function getButtonState(
    pagerNumber: number,
    owner: Order | undefined,
  ): PagerButtonState {
    if (pagerNumber === value) {
      return 'selected';
    }
    return owner && owner.id !== currentOrderId ? 'busy' : 'free';
  }

  return (
    <Modal
      title="Chọn thẻ rung"
      description="Chọn đúng số in trên thẻ đưa cho khách."
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            disabled={value === null}
            onClick={() => onSelect(null)}
          >
            Không dùng thẻ
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {pagerNumbers.map((pagerNumber) => {
          const owner = pagersInUse.get(pagerNumber);
          const state = getButtonState(pagerNumber, owner);
          const isBusy = state === 'busy';
          return (
            <button
              key={pagerNumber}
              type="button"
              disabled={isBusy}
              aria-pressed={state === 'selected'}
              aria-label={
                isBusy && owner
                  ? `Thẻ ${pagerNumber}, đang dùng cho đơn ${formatOrderNumber(owner.number)}`
                  : `Thẻ ${pagerNumber}`
              }
              onClick={() => onSelect(pagerNumber)}
              className={cn(
                'flex aspect-square flex-col items-center justify-center rounded-xl border text-lg font-bold tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none',
                PAGER_BUTTON_CLASSES[state],
              )}
            >
              {pagerNumber}
              {isBusy && owner && (
                <span className="font-mono text-[10px] font-medium">
                  {formatOrderNumber(owner.number)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
