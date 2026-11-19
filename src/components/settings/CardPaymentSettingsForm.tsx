'use client';

import { Check } from 'lucide-react';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { CARD_BRAND_LABELS, CARD_BRANDS } from '@/data/card-brands';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { cn } from '@/lib/cn';
import { prepareCardPaymentSettings } from '@/lib/settings/prepare-card-payment-settings';
import type { CardBrand } from '@/types/order';
import type { SettingsStatus } from '@/types/settings-status';
import { SettingsCard } from './SettingsCard';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

export function CardPaymentSettingsForm({
  status,
}: {
  status: SettingsStatus;
}) {
  const form = useSettingsDraft('cardPayment', {
    prepare: prepareCardPaymentSettings,
    successMessage: 'Đã lưu cài đặt thanh toán thẻ',
  });
  const { draft, update } = form;

  function toggleBrand(brand: CardBrand) {
    const accepted = new Set(draft.acceptedBrands);
    if (accepted.has(brand)) {
      accepted.delete(brand);
    } else {
      accepted.add(brand);
    }
    // Giữ thứ tự cố định để các nút loại thẻ lúc thanh toán không đổi chỗ.
    update({
      acceptedBrands: CARD_BRANDS.filter((candidate) =>
        accepted.has(candidate),
      ),
    });
  }

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.cardPayment}
      status={status}
      form={form}
    >
      <SettingsSwitchRow
        label="Nhận thanh toán thẻ"
        description="Hiện hình thức thẻ khi thanh toán kèm hướng dẫn dùng máy POS."
        checked={draft.enabled}
        onChange={(enabled) => update({ enabled })}
      />
      <fieldset
        disabled={!draft.enabled}
        className="flex flex-col gap-4 disabled:opacity-60"
      >
        <legend className="sr-only">Thông tin máy POS</legend>
        <div>
          <p className="mb-2 text-sm font-semibold">Loại thẻ chấp nhận</p>
          <div className="flex flex-wrap gap-2">
            {CARD_BRANDS.map((brand) => {
              const isAccepted = draft.acceptedBrands.includes(brand);
              return (
                <ToggleChip
                  key={brand}
                  isPressed={isAccepted}
                  onClick={() => toggleBrand(brand)}
                >
                  {isAccepted && (
                    <Check aria-hidden="true" className="size-3.5" />
                  )}
                  {CARD_BRAND_LABELS[brand]}
                </ToggleChip>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Tên máy POS"
              htmlFor="card-terminal-name"
              hint="Hiện trong hướng dẫn khi thu ngân chọn thanh toán thẻ."
            >
              <input
                id="card-terminal-name"
                maxLength={40}
                placeholder="POS Vietcombank quầy 1"
                value={draft.terminalName}
                onChange={(event) =>
                  update({ terminalName: event.target.value })
                }
                className={INPUT_CLASS_NAME}
              />
            </Field>
          </div>
          <Field label="Mã thiết bị (TID)" htmlFor="card-terminal-id">
            <input
              id="card-terminal-id"
              autoComplete="off"
              spellCheck={false}
              maxLength={16}
              placeholder="VD: 12345678"
              value={draft.terminalId}
              onChange={(event) => update({ terminalId: event.target.value })}
              className={cn(INPUT_CLASS_NAME, 'font-mono uppercase')}
            />
          </Field>
          <Field
            label="Mã đơn vị chấp nhận thẻ (MID)"
            htmlFor="card-merchant-id"
          >
            <input
              id="card-merchant-id"
              autoComplete="off"
              spellCheck={false}
              maxLength={20}
              placeholder="VD: 000000123456789"
              value={draft.merchantId}
              onChange={(event) => update({ merchantId: event.target.value })}
              className={cn(INPUT_CLASS_NAME, 'font-mono uppercase')}
            />
          </Field>
        </div>
        <SettingsSwitchRow
          label="Bắt buộc nhập mã chuẩn chi"
          description="Thu ngân phải chép mã chuẩn chi trên biên lai máy POS trước khi xác nhận."
          checked={draft.requireApprovalCode}
          onChange={(requireApprovalCode) => update({ requireApprovalCode })}
        />
      </fieldset>
      <SettingsNote title="Kết nối máy quẹt thẻ Visa/Mastercard">
        Máy POS do ngân hàng cấp chạy độc lập: YangPOS hiện số tiền để thu ngân
        bấm trên máy POS, sau đó lưu loại thẻ, 4 số cuối và mã chuẩn chi để đối
        soát cuối ngày. YangPOS không đọc hay lưu số thẻ đầy đủ. Muốn tự đẩy số
        tiền sang máy POS (kết nối ECR) cần bộ giao thức riêng của ngân hàng cấp
        máy.
      </SettingsNote>
    </SettingsCard>
  );
}
