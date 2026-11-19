'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { getErrorMessage } from '@/lib/get-error-message';
import type { DiningTable, DiningTableInput } from '@/types/dining-table';

const FORM_ID = 'table-form';
const DEFAULT_SEATS = 4;
const SEAT_PRESETS = [2, 4, 6, 8];

interface TableFormDialogProps {
  table?: DiningTable;
  onClose: () => void;
  onSubmit: (input: DiningTableInput) => Promise<void>;
}

export function TableFormDialog({
  table,
  onClose,
  onSubmit,
}: TableFormDialogProps) {
  const [name, setName] = useState(table?.name ?? '');
  const [seats, setSeats] = useState(table?.seats ?? DEFAULT_SEATS);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name, seats });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={table ? 'Sửa bàn' : 'Thêm bàn'}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {table ? 'Lưu thay đổi' : 'Thêm bàn'}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <Field label="Tên bàn" htmlFor="table-name">
          <input
            id="table-name"
            data-autofocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Bàn 9, Sân vườn 2…"
            className={INPUT_CLASS_NAME}
          />
        </Field>
        <Field label="Số ghế" htmlFor="table-seats">
          <div className="flex gap-2">
            {SEAT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={seats === preset}
                onClick={() => setSeats(preset)}
                className={cn(
                  'h-11 flex-1 rounded-xl border text-sm font-semibold transition-colors',
                  seats === preset
                    ? 'border-brand bg-brand-soft text-brand-dark'
                    : 'border-line bg-surface text-ink-soft shadow-card hover:text-ink',
                )}
              >
                {preset}
              </button>
            ))}
            <div className="w-20 shrink-0">
              <input
                id="table-seats"
                type="number"
                min={1}
                value={seats}
                onChange={(event) => setSeats(event.target.valueAsNumber || 0)}
                aria-label="Số ghế khác"
                className={cn(INPUT_CLASS_NAME, 'text-center')}
              />
            </div>
          </div>
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
