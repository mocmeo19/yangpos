'use client';

import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { VIETNAM_BANKS } from '@/data/vietnam-banks';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { cn } from '@/lib/cn';
import { prepareBankTransferSettings } from '@/lib/settings/prepare-bank-transfer-settings';
import {
  buildTransferNote,
  MAX_TRANSFER_NOTE_PREFIX_LENGTH,
  toBankText,
} from '@/lib/transfer-note';
import type { SettingsStatus } from '@/types/settings-status';
import { BankQrPreview } from './BankQrPreview';
import { SettingsCard } from './SettingsCard';
import { SettingsSwitchRow } from './SettingsSwitchRow';

const EXAMPLE_ORDER_NUMBER = 7;

export function BankTransferSettingsForm({
  status,
}: {
  status: SettingsStatus;
}) {
  const form = useSettingsDraft('bankTransfer', {
    prepare: prepareBankTransferSettings,
    successMessage: 'Đã lưu tài khoản nhận chuyển khoản',
  });
  const { draft, update } = form;
  const exampleNote = buildTransferNote(draft.notePrefix, EXAMPLE_ORDER_NUMBER);

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.bankTransfer}
      status={status}
      form={form}
    >
      <SettingsSwitchRow
        label="Nhận chuyển khoản"
        description="Hiện hình thức chuyển khoản kèm mã VietQR khi thanh toán."
        checked={draft.enabled}
        onChange={(enabled) => update({ enabled })}
      />
      <fieldset
        disabled={!draft.enabled}
        className="grid gap-6 disabled:opacity-60 md:grid-cols-[minmax(0,1fr)_216px]"
      >
        <legend className="sr-only">Tài khoản nhận tiền</legend>
        <div className="grid content-start gap-4">
          <Field label="Ngân hàng" htmlFor="bank-bin">
            <select
              id="bank-bin"
              value={draft.bankBin}
              onChange={(event) => update({ bankBin: event.target.value })}
              className={INPUT_CLASS_NAME}
            >
              <option value="">Chọn ngân hàng</option>
              {VIETNAM_BANKS.map((bank) => (
                <option key={bank.bin} value={bank.bin}>
                  {bank.shortName} – {bank.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Số tài khoản" htmlFor="bank-account-number">
            <input
              id="bank-account-number"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              maxLength={24}
              placeholder="0123456789"
              value={draft.accountNumber}
              onChange={(event) =>
                update({ accountNumber: event.target.value })
              }
              className={cn(INPUT_CLASS_NAME, 'font-mono')}
            />
          </Field>
          <Field
            label="Tên chủ tài khoản"
            htmlFor="bank-account-name"
            hint="Viết hoa không dấu, đúng như trong ứng dụng ngân hàng."
          >
            <input
              id="bank-account-name"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={50}
              placeholder="NGUYEN VAN A"
              value={draft.accountName}
              onChange={(event) => update({ accountName: event.target.value })}
              onBlur={() =>
                update({ accountName: toBankText(draft.accountName) })
              }
              className={cn(INPUT_CLASS_NAME, 'uppercase')}
            />
          </Field>
          <Field
            label="Tiền tố nội dung chuyển khoản"
            htmlFor="bank-note-prefix"
            hint={`Nội dung mẫu: ${exampleNote}. Số phía sau là số đơn, giúp đối chiếu tiền về với từng đơn.`}
          >
            <input
              id="bank-note-prefix"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={MAX_TRANSFER_NOTE_PREFIX_LENGTH}
              value={draft.notePrefix}
              onChange={(event) => update({ notePrefix: event.target.value })}
              onBlur={() =>
                update({ notePrefix: toBankText(draft.notePrefix) })
              }
              className={cn(INPUT_CLASS_NAME, 'font-mono uppercase')}
            />
          </Field>
          <SettingsSwitchRow
            label="In mã QR trên phiếu tạm tính"
            description="Khách quét mã ngay trên phiếu để chuyển đúng số tiền."
            checked={draft.showQrOnReceipt}
            onChange={(showQrOnReceipt) => update({ showQrOnReceipt })}
          />
        </div>
        <BankQrPreview bankTransfer={draft} />
      </fieldset>
    </SettingsCard>
  );
}
