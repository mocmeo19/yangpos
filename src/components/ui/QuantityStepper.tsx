import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface QuantityStepperProps {
  quantity: number;
  itemName: string;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
}

export function QuantityStepper({
  quantity,
  itemName,
  onDecrease,
  onIncrease,
  className,
}: QuantityStepperProps) {
  // Ở số lượng cuối cùng, nút giảm trở thành nút bỏ món để người dùng biết trước hệ quả.
  const isLastUnit = quantity <= 1;
  const DecreaseIcon = isLastUnit ? Trash2 : Minus;

  return (
    <div
      className={cn(
        'inline-flex h-9 items-center rounded-full border border-line bg-surface p-0.5 shadow-card',
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label={isLastUnit ? `Bỏ ${itemName}` : `Giảm ${itemName}`}
        className={cn(
          'grid size-8 place-items-center rounded-full transition-colors',
          isLastUnit
            ? 'text-danger hover:bg-danger-soft'
            : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
        )}
      >
        <DecreaseIcon className="size-4" />
      </button>
      <span
        key={quantity}
        className="min-w-7 text-center text-sm font-bold tabular-nums motion-safe:animate-pop"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`Thêm ${itemName}`}
        className="grid size-8 place-items-center rounded-full text-brand transition-colors hover:bg-brand-soft"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
