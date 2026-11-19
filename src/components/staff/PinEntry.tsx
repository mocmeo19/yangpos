'use client';

import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { useEffect, useEffectEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberKeypad } from '@/components/ui/NumberKeypad';
import { DEFAULT_OWNER_PIN } from '@/data/default-staff';
import { useKeypadKeyboard } from '@/hooks/use-keypad-keyboard';
import { cn } from '@/lib/cn';
import { applyPinKey } from '@/lib/staff/apply-pin-key';
import { getErrorMessage } from '@/lib/get-error-message';
import { MIN_PIN_LENGTH } from '@/lib/staff/pin-format';
import type { KeypadKey } from '@/types/keypad';
import type { Employee } from '@/types/staff';
import { StaffAvatar } from './StaffAvatar';

const PIN_KEYPAD_LAYOUT: readonly KeypadKey[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'clear',
  '0',
  'backspace',
];

interface PinEntryProps {
  employee: Employee;
  roleName: string;
  showDefaultPinHint: boolean;
  /** Gửi PIN cho máy chủ kiểm tra; ném lỗi kèm thông báo khi sai hoặc đang bị tạm khóa. */
  onSubmitPin: (pin: string) => Promise<void>;
  onBack: () => void;
}

export function PinEntry({
  employee,
  roleName,
  showDefaultPinHint,
  onSubmitPin,
  onBack,
}: PinEntryProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const canSubmit = pin.length >= MIN_PIN_LENGTH && !isChecking;
  const dotCount = Math.max(MIN_PIN_LENGTH, pin.length);

  function handleKey(key: KeypadKey) {
    if (isChecking) {
      return;
    }
    setPin((current) => applyPinKey(current, key));
    setError(null);
  }

  async function submit() {
    if (!canSubmit) {
      return;
    }
    setIsChecking(true);
    try {
      await onSubmitPin(pin);
    } catch (submitError) {
      setPin('');
      setError(getErrorMessage(submitError));
    } finally {
      setIsChecking(false);
    }
  }

  useKeypadKeyboard(handleKey);

  const submitOnEnter = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.defaultPrevented) {
      event.preventDefault();
      void submit();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', submitOnEnter);
    return () => window.removeEventListener('keydown', submitOnEnter);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <StaffAvatar name={employee.name} size="lg" />
        <div>
          <p className="text-lg font-bold tracking-tight">{employee.name}</p>
          <p className="text-sm text-ink-soft">{roleName}</p>
        </div>
      </div>

      <div
        role="status"
        aria-label={`Đã nhập ${pin.length} chữ số`}
        className="flex h-4 items-center gap-3"
      >
        {Array.from({ length: dotCount }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              'size-3.5 rounded-full border-2 transition-colors',
              index < pin.length
                ? 'border-ink bg-ink'
                : 'border-line-strong bg-transparent',
            )}
          />
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="w-full max-w-xs rounded-xl bg-danger-soft px-3 py-2.5 text-center text-sm text-danger"
        >
          {error}
        </p>
      )}
      {!error && showDefaultPinHint && (
        <p className="w-full max-w-xs rounded-xl bg-warning-soft px-3 py-2.5 text-center text-sm text-warning">
          PIN mặc định là{' '}
          <strong className="font-mono">{DEFAULT_OWNER_PIN}</strong>. Hãy đổi
          PIN ở mục Nhân viên sau khi vào.
        </p>
      )}

      <NumberKeypad
        label="Bàn phím nhập mã PIN"
        keys={PIN_KEYPAD_LAYOUT}
        onKey={handleKey}
        className={cn(
          'w-full max-w-xs',
          isChecking && 'pointer-events-none opacity-50',
        )}
      />

      <div className="flex w-full max-w-xs flex-col gap-2">
        <Button size="lg" disabled={!canSubmit} onClick={() => void submit()}>
          <LockKeyhole className="size-4" />
          {isChecking ? 'Đang kiểm tra…' : 'Mở khóa'}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Chọn người khác
        </Button>
      </div>
    </div>
  );
}
