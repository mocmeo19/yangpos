'use client';

import { Building, UserRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import { cn } from '@/lib/cn';
import { prepareInvoiceBuyer } from '@/lib/einvoice/prepare-invoice-buyer';
import { getErrorMessage } from '@/lib/get-error-message';
import type { InvoiceBuyer, InvoiceBuyerKind } from '@/types/einvoice';

const FORM_ID = 'invoice-buyer-form';

const EMPTY_BUYER: InvoiceBuyer = {
  kind: 'company',
  name: '',
  taxCode: '',
  personalId: '',
  address: '',
  phone: '',
  email: '',
};

const BUYER_KIND_OPTIONS: readonly SegmentedOption<InvoiceBuyerKind>[] = [
  { value: 'company', label: 'Doanh nghiệp', icon: Building },
  { value: 'individual', label: 'Cá nhân', icon: UserRound },
];

interface InvoiceBuyerDialogProps {
  initialBuyer: InvoiceBuyer | null;
  onClose: () => void;
  onSubmit: (buyer: InvoiceBuyer) => void;
}

/** Theo Nghị định 70/2025/NĐ-CP, chỉ ghi thông tin người mua khi khách yêu cầu. */
export function InvoiceBuyerDialog({
  initialBuyer,
  onClose,
  onSubmit,
}: InvoiceBuyerDialogProps) {
  const [buyer, setBuyer] = useState<InvoiceBuyer>(initialBuyer ?? EMPTY_BUYER);
  const [error, setError] = useState<string | null>(null);
  const isCompany = buyer.kind === 'company';

  function update<K extends keyof InvoiceBuyer>(
    key: K,
    value: InvoiceBuyer[K],
  ) {
    setBuyer((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      onSubmit(prepareInvoiceBuyer(buyer));
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  return (
    <Modal
      title="Thông tin người mua"
      description="Ghi lên hóa đơn điện tử khi khách yêu cầu."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID}>
            Dùng thông tin này
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
        <SegmentedControl
          label="Người mua là"
          options={BUYER_KIND_OPTIONS}
          value={buyer.kind}
          onChange={(kind) => update('kind', kind)}
        />

        <Field
          label={isCompany ? 'Tên đơn vị' : 'Họ tên người mua'}
          htmlFor="invoice-buyer-name"
        >
          <input
            id="invoice-buyer-name"
            data-autofocus
            value={buyer.name}
            onChange={(event) => update('name', event.target.value)}
            autoComplete={isCompany ? 'organization' : 'name'}
            placeholder={isCompany ? 'Công ty TNHH ABC' : 'Nguyễn Văn A'}
            className={INPUT_CLASS_NAME}
          />
        </Field>

        {isCompany && (
          <Field
            label="Mã số thuế"
            htmlFor="invoice-buyer-tax-code"
            hint="10 chữ số; chi nhánh thêm đuôi, vd 0101234567-001."
          >
            <input
              id="invoice-buyer-tax-code"
              inputMode="numeric"
              value={buyer.taxCode}
              onChange={(event) => update('taxCode', event.target.value)}
              placeholder="0101234567"
              autoComplete="off"
              spellCheck={false}
              className={cn(INPUT_CLASS_NAME, 'font-mono')}
            />
          </Field>
        )}
        {!isCompany && (
          <Field
            label="Số định danh cá nhân (không bắt buộc)"
            htmlFor="invoice-buyer-personal-id"
            hint="Số căn cước 12 chữ số."
          >
            <input
              id="invoice-buyer-personal-id"
              inputMode="numeric"
              value={buyer.personalId}
              onChange={(event) => update('personalId', event.target.value)}
              placeholder="001090012345"
              autoComplete="off"
              spellCheck={false}
              className={cn(INPUT_CLASS_NAME, 'font-mono')}
            />
          </Field>
        )}

        <Field
          label={isCompany ? 'Địa chỉ' : 'Địa chỉ (không bắt buộc)'}
          htmlFor="invoice-buyer-address"
        >
          <input
            id="invoice-buyer-address"
            value={buyer.address}
            onChange={(event) => update('address', event.target.value)}
            autoComplete="street-address"
            className={INPUT_CLASS_NAME}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Số điện thoại" htmlFor="invoice-buyer-phone">
            <input
              id="invoice-buyer-phone"
              type="tel"
              inputMode="tel"
              value={buyer.phone}
              onChange={(event) => update('phone', event.target.value)}
              autoComplete="tel"
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <Field label="Email nhận hóa đơn" htmlFor="invoice-buyer-email">
            <input
              id="invoice-buyer-email"
              type="email"
              inputMode="email"
              value={buyer.email}
              onChange={(event) => update('email', event.target.value)}
              autoComplete="email"
              spellCheck={false}
              className={INPUT_CLASS_NAME}
            />
          </Field>
        </div>

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
