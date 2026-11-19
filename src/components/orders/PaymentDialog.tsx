'use client';

import { Printer } from 'lucide-react';
import { useState } from 'react';
import { CardPaymentPanel } from '@/components/payment/CardPaymentPanel';
import { CashPaymentPanel } from '@/components/payment/CashPaymentPanel';
import { InvoiceBuyerDialog } from '@/components/payment/InvoiceBuyerDialog';
import { InvoiceBuyerSummary } from '@/components/payment/InvoiceBuyerSummary';
import { PaymentMethodPicker } from '@/components/payment/PaymentMethodPicker';
import { TransferPaymentPanel } from '@/components/payment/TransferPaymentPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePrintOrderReceipt } from '@/hooks/use-print-order-receipt';
import { useSettings } from '@/hooks/use-settings';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { applyKeypadKey } from '@/lib/keypad/apply-keypad-key';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import { buildPaymentInput } from '@/lib/payment/build-payment-input';
import { getAvailablePaymentMethods } from '@/lib/payment/get-available-payment-methods';
import { planAfterPayment } from '@/lib/payment/plan-after-payment';
import { validateCardPayment } from '@/lib/payment/validate-card-payment';
import { buildTransferNote } from '@/lib/transfer-note';
import type { CheckoutInput } from '@/types/checkout';
import type { InvoiceBuyer } from '@/types/einvoice';
import type { KeypadEntry, KeypadKey } from '@/types/keypad';
import type { Order, PaymentMethod } from '@/types/order';
import type { CardPaymentDraft } from '@/types/payment-form';

const EMPTY_CARD: CardPaymentDraft = {
  brand: null,
  last4: '',
  approvalCode: '',
};

interface PaymentDialogProps {
  order: Order;
  tableName: string;
  onClose: () => void;
  /** Lỗi ném ra từ đây được hiển thị ngay trong hộp thoại để thu ngân thử lại. */
  onConfirm: (checkout: CheckoutInput) => Promise<void>;
}

export function PaymentDialog({
  order,
  tableName,
  onClose,
  onConfirm,
}: PaymentDialogProps) {
  const { settings } = useSettings();
  const printOrderReceipt = usePrintOrderReceipt();
  const total = calculateItemsTotal(order.items);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  // Bắt đầu bằng số tiền vừa đủ, coi như đang được chọn để thu ngân gõ đè số tiền khách đưa.
  const [cashEntry, setCashEntry] = useState<KeypadEntry>({
    amount: total,
    replaceOnNextDigit: true,
  });
  const [card, setCard] = useState<CardPaymentDraft>(EMPTY_CARD);
  const [invoiceBuyer, setInvoiceBuyer] = useState<InvoiceBuyer | null>(null);
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transferNote = buildTransferNote(
    settings.bankTransfer.notePrefix,
    order.number,
  );
  const cardHint = validateCardPayment(card, settings.cardPayment);

  function isReadyToConfirm(): boolean {
    switch (paymentMethod) {
      case 'cash':
        return cashEntry.amount >= total;
      case 'card':
        return cardHint === null;
      default:
        return true;
    }
  }

  async function handleConfirm() {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm({
        payment: buildPaymentInput(paymentMethod, {
          cashReceived: cashEntry.amount,
          transferNote,
          card,
        }),
        invoiceBuyer,
      });
    } catch (confirmError) {
      setError(getErrorMessage(confirmError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCashKey(key: KeypadKey) {
    // Hộp thoại người mua đang mở phía trên: phím số không được đổi số tiền khách đưa bên dưới.
    if (isEditingBuyer) {
      return;
    }
    setCashEntry((current) => applyKeypadKey(current, key));
  }

  function handleBuyerSubmit(buyer: InvoiceBuyer) {
    setInvoiceBuyer(buyer);
    setIsEditingBuyer(false);
  }

  async function handlePrintBill() {
    setIsPrinting(true);
    try {
      await printOrderReceipt(order, 'provisional');
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <>
      <Modal
        title="Thanh toán"
        description={`${formatOrderNumber(order.number)} · ${tableName} · ${countItems(order.items)} món`}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Để sau
            </Button>
            <Button
              disabled={!isReadyToConfirm() || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? 'Đang xử lý…' : 'Xác nhận đã thu'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-3 text-white sm:py-4">
            <div className="min-w-0">
              <p className="text-sm text-white/70">Khách cần trả</p>
              <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                {formatCurrency(total)}
              </p>
            </div>
            <button
              type="button"
              disabled={isPrinting}
              onClick={handlePrintBill}
              aria-label="In phiếu tạm tính"
              title="In phiếu tạm tính"
              className="inline-flex size-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white/10 text-sm font-semibold transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none disabled:opacity-50 sm:w-auto sm:px-3"
            >
              <Printer aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">In tạm tính</span>
            </button>
          </div>

          {settings.eInvoice.enabled && (
            <InvoiceBuyerSummary
              buyer={invoiceBuyer}
              autoIssue={settings.eInvoice.autoIssueOnPayment}
              onEdit={() => setIsEditingBuyer(true)}
              onClear={() => setInvoiceBuyer(null)}
            />
          )}

          <PaymentMethodPicker
            methods={getAvailablePaymentMethods(settings)}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          {paymentMethod === 'cash' && (
            <CashPaymentPanel
              total={total}
              entry={cashEntry}
              onKey={handleCashKey}
              onSuggestionSelect={(amount) =>
                setCashEntry({ amount, replaceOnNextDigit: true })
              }
              opensCashDrawer={
                planAfterPayment(settings, 'cash').openCashDrawer
              }
            />
          )}
          {paymentMethod === 'transfer' && (
            <TransferPaymentPanel
              total={total}
              transferNote={transferNote}
              bankTransfer={settings.bankTransfer}
            />
          )}
          {paymentMethod === 'card' && (
            <CardPaymentPanel
              total={total}
              cardPayment={settings.cardPayment}
              card={card}
              onCardChange={setCard}
              hint={cardHint}
            />
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          )}
        </div>
      </Modal>
      {isEditingBuyer && (
        <InvoiceBuyerDialog
          initialBuyer={invoiceBuyer}
          onClose={() => setIsEditingBuyer(false)}
          onSubmit={handleBuyerSubmit}
        />
      )}
    </>
  );
}
