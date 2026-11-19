'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CASH_CATEGORIES } from '@/data/cash-categories';
import { CASH_FUND_OPTIONS } from '@/data/cash-fund-options';
import { useNow } from '@/hooks/use-now';
import { useToast } from '@/hooks/use-toast';
import { formatAmountInput, parseAmountInput } from '@/lib/amount-input';
import { cn } from '@/lib/cn';
import {
  parseDateTimeInputValue,
  toDateTimeInputValue,
} from '@/lib/datetime-input';
import { formatCurrency } from '@/lib/format-currency';
import { getErrorMessage } from '@/lib/get-error-message';
import { addCashEntry } from '@/api-client/cash-entry-api';
import type { CashEntryType, CashFund } from '@/types/cash-entry';

const FORM_ID = 'cash-entry-form';
const CLOCK_INTERVAL_MS = 60_000;

const ENTRY_NAMES: Record<CashEntryType, string> = {
  receipt: 'phiếu thu',
  payment: 'phiếu chi',
};

const DIALOG_TITLES: Record<CashEntryType, string> = {
  receipt: 'Lập phiếu thu',
  payment: 'Lập phiếu chi',
};

const COUNTERPARTY_LABELS: Record<CashEntryType, string> = {
  receipt: 'Người nộp tiền',
  payment: 'Người nhận tiền',
};

interface CashEntryFormDialogProps {
  type: CashEntryType;
  fund: CashFund;
  onClose: () => void;
}

export function CashEntryFormDialog({
  type,
  fund: initialFund,
  onClose,
}: CashEntryFormDialogProps) {
  const showToast = useToast();
  const now = useNow(CLOCK_INTERVAL_MS);
  const categories = CASH_CATEGORIES.filter(
    (category) => category.type === type,
  );
  const [fund, setFund] = useState<CashFund>(initialFund);
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [amount, setAmount] = useState(0);
  // `null` nghĩa là "ngay bây giờ": lưu đúng thời điểm bấm lưu thay vì giờ đã cắt về đầu phút.
  const [occurredAt, setOccurredAt] = useState<string | null>(null);
  const [counterparty, setCounterparty] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const entry = await addCashEntry({
        type,
        fund,
        categoryId,
        amount,
        counterparty,
        note,
        occurredAt:
          occurredAt === null
            ? Date.now()
            : parseDateTimeInputValue(occurredAt),
      });
      showToast({
        title: `Đã lập ${ENTRY_NAMES[type]} ${entry.number}`,
        description: formatCurrency(entry.amount),
      });
      onClose();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={DIALOG_TITLES[type]}
      description="Số phiếu được cấp tự động khi lưu."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu…' : `Lưu ${ENTRY_NAMES[type]}`}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <div>
          <p aria-hidden="true" className="mb-1.5 text-sm font-semibold">
            Quỹ
          </p>
          <SegmentedControl
            label="Quỹ"
            options={CASH_FUND_OPTIONS}
            value={fund}
            onChange={setFund}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Số tiền (₫)" htmlFor="cash-entry-amount">
            <input
              id="cash-entry-amount"
              data-autofocus
              inputMode="numeric"
              value={formatAmountInput(amount)}
              onChange={(event) =>
                setAmount(parseAmountInput(event.target.value))
              }
              placeholder="0"
              className={cn(INPUT_CLASS_NAME, 'text-right font-mono')}
            />
          </Field>
          <Field label="Khoản mục" htmlFor="cash-entry-category">
            <select
              id="cash-entry-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={INPUT_CLASS_NAME}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Thời gian" htmlFor="cash-entry-occurred-at">
            <input
              id="cash-entry-occurred-at"
              type="datetime-local"
              value={occurredAt ?? toDateTimeInputValue(now)}
              max={toDateTimeInputValue(now)}
              onChange={(event) => setOccurredAt(event.target.value)}
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <Field
            label={COUNTERPARTY_LABELS[type]}
            htmlFor="cash-entry-counterparty"
          >
            <input
              id="cash-entry-counterparty"
              maxLength={80}
              placeholder="Không bắt buộc"
              value={counterparty}
              onChange={(event) => setCounterparty(event.target.value)}
              className={INPUT_CLASS_NAME}
            />
          </Field>
        </div>

        <Field label="Diễn giải" htmlFor="cash-entry-note">
          <input
            id="cash-entry-note"
            maxLength={160}
            placeholder="VD: Mua rau, thịt cho ngày 07/11"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={INPUT_CLASS_NAME}
          />
        </Field>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
