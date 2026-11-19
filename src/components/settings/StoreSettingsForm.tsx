'use client';

import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { useNow } from '@/hooks/use-now';
import { useSettings } from '@/hooks/use-settings';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { cn } from '@/lib/cn';
import { buildReceipt } from '@/lib/receipt/build-receipt';
import { createSampleOrder } from '@/lib/receipt/create-sample-order';
import { prepareStoreSettings } from '@/lib/settings/prepare-store-settings';
import type { SettingsStatus } from '@/types/settings-status';
import { ReceiptPreview } from './ReceiptPreview';
import { SettingsCard } from './SettingsCard';

const PREVIEW_CLOCK_MS = 60_000;
const PREVIEW_TABLE_NAME = 'Bàn 2';

export function StoreSettingsForm({ status }: { status: SettingsStatus }) {
  const { settings } = useSettings();
  const form = useSettingsDraft('store', {
    prepare: prepareStoreSettings,
    successMessage: 'Đã lưu thông tin cửa hàng',
  });
  const { draft, update } = form;
  const now = useNow(PREVIEW_CLOCK_MS);
  const previewReceipt = buildReceipt({
    order: createSampleOrder(now),
    tableName: PREVIEW_TABLE_NAME,
    settings: { ...settings, store: draft },
    kind: 'provisional',
    printedAt: now,
  });

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.store}
      status={status}
      form={form}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Tên cửa hàng" htmlFor="store-name">
              <input
                id="store-name"
                maxLength={60}
                placeholder="Quán Phở Yang"
                value={draft.name}
                onChange={(event) => update({ name: event.target.value })}
                className={INPUT_CLASS_NAME}
              />
            </Field>
          </div>
          <Field label="Số điện thoại" htmlFor="store-phone">
            <input
              id="store-phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="0901 234 567"
              value={draft.phone}
              onChange={(event) => update({ phone: event.target.value })}
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <Field label="Mã số thuế" htmlFor="store-tax-code">
            <input
              id="store-tax-code"
              inputMode="numeric"
              maxLength={14}
              placeholder="Không bắt buộc"
              value={draft.taxCode}
              onChange={(event) => update({ taxCode: event.target.value })}
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Địa chỉ" htmlFor="store-address">
              <input
                id="store-address"
                autoComplete="street-address"
                maxLength={120}
                placeholder="12 Lê Lợi, Quận 1, TP.HCM"
                value={draft.address}
                onChange={(event) => update({ address: event.target.value })}
                className={INPUT_CLASS_NAME}
              />
            </Field>
          </div>
          <Field label="Tên Wi-Fi" htmlFor="store-wifi-name">
            <input
              id="store-wifi-name"
              autoComplete="off"
              maxLength={32}
              placeholder="Không bắt buộc"
              value={draft.wifiName}
              onChange={(event) => update({ wifiName: event.target.value })}
              className={INPUT_CLASS_NAME}
            />
          </Field>
          <Field label="Mật khẩu Wi-Fi" htmlFor="store-wifi-password">
            <input
              id="store-wifi-password"
              autoComplete="off"
              spellCheck={false}
              maxLength={63}
              value={draft.wifiPassword}
              onChange={(event) => update({ wifiPassword: event.target.value })}
              className={cn(INPUT_CLASS_NAME, 'font-mono')}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Lời nhắn cuối hóa đơn" htmlFor="store-receipt-footer">
              <input
                id="store-receipt-footer"
                maxLength={160}
                value={draft.receiptFooter}
                onChange={(event) =>
                  update({ receiptFooter: event.target.value })
                }
                className={INPUT_CLASS_NAME}
              />
            </Field>
          </div>
        </div>
        <ReceiptPreview receipt={previewReceipt} />
      </div>
    </SettingsCard>
  );
}
