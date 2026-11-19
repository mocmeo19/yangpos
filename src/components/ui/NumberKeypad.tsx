import { Delete } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { KeypadKey } from '@/types/keypad';

interface KeyPresentation {
  content: ReactNode;
  ariaLabel?: string;
  className: string;
}

const AMOUNT_KEYPAD_LAYOUT: readonly KeypadKey[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '000',
  '0',
  'backspace',
];

const KEY_CLASS =
  'grid h-11 touch-manipulation place-items-center rounded-xl border border-line bg-surface font-semibold tabular-nums shadow-card transition-[transform,background-color] select-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none active:scale-95 active:bg-line/60 sm:h-14';

function presentKey(key: KeypadKey): KeyPresentation {
  switch (key) {
    case 'clear':
      return {
        content: 'C',
        ariaLabel: 'Xóa hết',
        className: 'text-lg text-ink-soft',
      };
    case 'backspace':
      return {
        content: <Delete aria-hidden="true" className="size-6" />,
        ariaLabel: 'Xóa số cuối',
        className: 'text-ink-soft',
      };
    case '000':
      return {
        content: '000',
        ariaLabel: 'Thêm ba số 0',
        className: 'text-lg',
      };
    default:
      return { content: key, className: 'text-xl' };
  }
}

interface NumberKeypadProps {
  label: string;
  onKey: (key: KeypadKey) => void;
  /** Mặc định là bàn phím nhập tiền (có phím 000); 12 phím xếp thành 4 hàng 3 cột. */
  keys?: readonly KeypadKey[];
  className?: string;
}

/** Bàn phím số trên màn hình cho máy tính bảng và điện thoại, không bật bàn phím của hệ điều hành. */
export function NumberKeypad({
  label,
  onKey,
  keys = AMOUNT_KEYPAD_LAYOUT,
  className,
}: NumberKeypadProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('grid grid-cols-3 gap-2', className)}
    >
      {keys.map((key) => {
        const presentation = presentKey(key);
        return (
          <button
            key={key}
            type="button"
            aria-label={presentation.ariaLabel}
            onClick={() => onKey(key)}
            className={cn(KEY_CLASS, presentation.className)}
          >
            {presentation.content}
          </button>
        );
      })}
    </div>
  );
}
