'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import {
  parseDateTimeInputValue,
  toDateTimeInputValue,
} from '@/lib/datetime-input';
import { getErrorMessage } from '@/lib/get-error-message';
import type { DiningTable } from '@/types/dining-table';
import type { Reservation, ReservationInput } from '@/types/reservation';

const FORM_ID = 'reservation-form';
const PARTY_SIZE_PRESETS = [2, 4, 6, 8];
const NO_TABLE = '';

interface ReservationFormDialogProps {
  reservation?: Reservation;
  /** Giờ gợi ý khi thêm mới. */
  defaultReservedAt: number;
  tables: readonly DiningTable[];
  onClose: () => void;
  onSubmit: (input: ReservationInput) => Promise<void>;
}

function describeTableOption(table: DiningTable, partySize: number): string {
  if (table.seats < partySize) {
    return `${table.name} · ${table.seats} ghế (thiếu chỗ)`;
  }
  return `${table.name} · ${table.seats} ghế`;
}

export function ReservationFormDialog({
  reservation,
  defaultReservedAt,
  tables,
  onClose,
  onSubmit,
}: ReservationFormDialogProps) {
  const [customerName, setCustomerName] = useState(
    reservation?.customerName ?? '',
  );
  const [phone, setPhone] = useState(reservation?.phone ?? '');
  const [partySize, setPartySize] = useState(reservation?.partySize ?? 2);
  const [reservedAtValue, setReservedAtValue] = useState(
    toDateTimeInputValue(reservation?.reservedAt ?? defaultReservedAt),
  );
  const [tableId, setTableId] = useState(reservation?.tableId ?? NO_TABLE);
  const [note, setNote] = useState(reservation?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = reservation !== undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        customerName,
        phone,
        partySize,
        reservedAt: parseDateTimeInputValue(reservedAtValue),
        tableId: tableId || null,
        note,
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Sửa đặt bàn' : 'Đặt bàn mới'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isEditing ? 'Lưu thay đổi' : 'Đặt bàn'}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên khách" htmlFor="reservation-name">
            <input
              id="reservation-name"
              data-autofocus
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Anh Nam"
              autoComplete="off"
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <Field label="Số điện thoại" htmlFor="reservation-phone">
            <input
              id="reservation-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0901 234 567"
              autoComplete="off"
              className={cn(INPUT_CLASS_NAME, 'font-mono')}
            />
          </Field>
        </div>

        <Field label="Số khách" htmlFor="reservation-party-size">
          <div className="flex gap-2">
            {PARTY_SIZE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={partySize === preset}
                onClick={() => setPartySize(preset)}
                className={cn(
                  'h-11 flex-1 rounded-xl border text-sm font-semibold transition-colors',
                  partySize === preset
                    ? 'border-brand bg-brand-soft text-brand-dark'
                    : 'border-line bg-surface text-ink-soft shadow-card hover:text-ink',
                )}
              >
                {preset}
              </button>
            ))}
            <div className="w-20 shrink-0">
              <input
                id="reservation-party-size"
                type="number"
                min={1}
                value={partySize}
                onChange={(event) =>
                  setPartySize(event.target.valueAsNumber || 0)
                }
                aria-label="Số khách khác"
                className={cn(INPUT_CLASS_NAME, 'text-center')}
              />
            </div>
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Giờ đến" htmlFor="reservation-time">
            <input
              id="reservation-time"
              type="datetime-local"
              step={300}
              value={reservedAtValue}
              onChange={(event) => setReservedAtValue(event.target.value)}
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <Field
            label="Bàn"
            htmlFor="reservation-table"
            hint="Có thể để trống và xếp bàn khi khách tới."
          >
            <select
              id="reservation-table"
              value={tableId}
              onChange={(event) => setTableId(event.target.value)}
              className={INPUT_CLASS_NAME}
            >
              <option value={NO_TABLE}>Chưa xếp bàn</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {describeTableOption(table, partySize)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Ghi chú" htmlFor="reservation-note">
          <textarea
            id="reservation-note"
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Sinh nhật, cần ghế em bé, đặt cọc…"
            className={cn(INPUT_CLASS_NAME, 'h-auto py-2.5')}
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
