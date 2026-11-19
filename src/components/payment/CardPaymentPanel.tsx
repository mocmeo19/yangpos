import type { ReactNode } from 'react';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { CARD_BRAND_LABELS } from '@/data/card-brands';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import type { CardBrand } from '@/types/order';
import type { CardPaymentDraft } from '@/types/payment-form';
import type { CardPaymentSettings } from '@/types/settings';

const LAST4_LENGTH = 4;
const MAX_APPROVAL_CODE_LENGTH = 12;

function TerminalStep({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white"
      >
        {step}
      </span>
      <span>{children}</span>
    </li>
  );
}

interface CardPaymentPanelProps {
  total: number;
  cardPayment: CardPaymentSettings;
  card: CardPaymentDraft;
  onCardChange: (card: CardPaymentDraft) => void;
  /** Lý do chưa xác nhận được, hiện ngay dưới ô nhập để thu ngân biết cần bổ sung gì. */
  hint: string | null;
}

/**
 * Máy POS ngân hàng chạy độc lập: thu ngân bấm số tiền trên máy, khách quẹt thẻ, rồi chép lại
 * 4 số cuối và mã chuẩn chi từ biên lai để đối soát. Không bao giờ nhập số thẻ đầy đủ ở đây.
 */
export function CardPaymentPanel({
  total,
  cardPayment,
  card,
  onCardChange,
  hint,
}: CardPaymentPanelProps) {
  const terminalName = cardPayment.terminalName.trim() || 'máy POS ngân hàng';

  function toggleBrand(brand: CardBrand) {
    onCardChange({ ...card, brand: card.brand === brand ? null : brand });
  }

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-soft">
        <TerminalStep step={1}>
          Nhập{' '}
          <strong className="font-mono text-ink">
            {formatCurrency(total)}
          </strong>{' '}
          trên {terminalName}.
        </TerminalStep>
        <TerminalStep step={2}>
          Mời khách quẹt, cắm hoặc chạm thẻ và nhập mã PIN nếu máy yêu cầu.
        </TerminalStep>
        <TerminalStep step={3}>
          Khi máy in biên lai giao dịch thành công, ghi lại thông tin bên dưới.
        </TerminalStep>
      </ol>

      {cardPayment.acceptedBrands.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Loại thẻ</legend>
          <div className="flex flex-wrap gap-2">
            {cardPayment.acceptedBrands.map((brand) => (
              <ToggleChip
                key={brand}
                isPressed={card.brand === brand}
                onClick={() => toggleBrand(brand)}
              >
                {CARD_BRAND_LABELS[brand]}
              </ToggleChip>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="4 số cuối thẻ" htmlFor="card-last4">
          <input
            id="card-last4"
            inputMode="numeric"
            autoComplete="off"
            placeholder="1234"
            value={card.last4}
            onChange={(event) =>
              onCardChange({
                ...card,
                // Lấy 4 số cuối để dán được cả dãy số che trên biên lai, vd ************1234.
                last4: event.target.value
                  .replace(/\D/g, '')
                  .slice(-LAST4_LENGTH),
              })
            }
            className={cn(INPUT_CLASS_NAME, 'font-mono tracking-widest')}
          />
        </Field>
        <Field
          label={
            cardPayment.requireApprovalCode
              ? 'Mã chuẩn chi'
              : 'Mã chuẩn chi (nếu có)'
          }
          htmlFor="card-approval-code"
        >
          <input
            id="card-approval-code"
            autoComplete="off"
            autoCapitalize="characters"
            maxLength={MAX_APPROVAL_CODE_LENGTH}
            placeholder="VD: 012345"
            value={card.approvalCode}
            onChange={(event) =>
              onCardChange({
                ...card,
                approvalCode: event.target.value.toUpperCase(),
              })
            }
            className={cn(INPUT_CLASS_NAME, 'font-mono uppercase')}
          />
        </Field>
      </div>

      {hint && <p className="text-xs font-medium text-warning">{hint}</p>}
    </div>
  );
}
