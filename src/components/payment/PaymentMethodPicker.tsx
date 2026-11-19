import {
  Banknote,
  CreditCard,
  QrCode as QrCodeIcon,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { PAYMENT_METHOD_LABELS } from '@/lib/payment-methods';
import type { PaymentMethod } from '@/types/order';

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  cash: Banknote,
  transfer: QrCodeIcon,
  card: CreditCard,
};

interface PaymentMethodPickerProps {
  methods: readonly PaymentMethod[];
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodPicker({
  methods,
  value,
  onChange,
}: PaymentMethodPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">
        Hình thức thanh toán
      </legend>
      <div className="grid auto-cols-fr grid-flow-col gap-2">
        {methods.map((method) => {
          const Icon = PAYMENT_METHOD_ICONS[method];
          const isSelected = method === value;
          return (
            <button
              key={method}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(method)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-brand bg-brand-soft text-brand-dark ring-2 ring-brand/15'
                  : 'border-line bg-surface text-ink-soft shadow-card hover:text-ink',
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
              {PAYMENT_METHOD_LABELS[method]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
