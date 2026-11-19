'use client';

import { PrinterCheck, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChoiceCards } from '@/components/ui/ChoiceCards';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { EINVOICE_PROVIDER_OPTIONS } from '@/data/einvoice-providers';
import { EINVOICE_TEMPLATE_OPTIONS } from '@/data/einvoice-templates';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { VAT_RATE_CODES, VAT_RATE_LABELS } from '@/data/vat-rates';
import { useEInvoiceTestPrint } from '@/hooks/use-einvoice-test-print';
import { useNow } from '@/hooks/use-now';
import { useSettings } from '@/hooks/use-settings';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { cn } from '@/lib/cn';
import { buildCashRegisterCode } from '@/lib/einvoice/build-cash-register-code';
import { getEInvoiceProvider } from '@/lib/einvoice/providers/get-einvoice-provider';
import { buildSampleEInvoiceReceipt } from '@/lib/receipt/build-sample-einvoice-receipt';
import { prepareEInvoiceSettings } from '@/lib/settings/prepare-einvoice-settings';
import type { VatRateCode } from '@/types/einvoice';
import type { EInvoiceProviderId } from '@/types/einvoice-provider';
import type { SettingsStatus } from '@/types/settings-status';
import { MisaConnectionPanel } from './MisaConnectionPanel';
import { ReceiptPreview } from './ReceiptPreview';
import { SettingsCard } from './SettingsCard';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

const PREVIEW_CLOCK_MS = 60_000;

function toVatRateCode(value: string, fallback: VatRateCode): VatRateCode {
  return VAT_RATE_CODES.find((code) => code === value) ?? fallback;
}

function toTaxAuthorityPrefix(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 5);
}

function toTerminalCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 2);
}

export function EInvoiceSettingsForm({ status }: { status: SettingsStatus }) {
  const { settings } = useSettings();
  const form = useSettingsDraft('eInvoice', {
    prepare: prepareEInvoiceSettings,
    successMessage: 'Đã lưu cài đặt hóa đơn điện tử',
  });
  const { draft, update } = form;
  const { isPrinting, testPrint } = useEInvoiceTestPrint();
  const now = useNow(PREVIEW_CLOCK_MS);
  const { store } = settings;
  const provider = getEInvoiceProvider(draft.providerId);
  const usesProviderNumbering = provider.numbering === 'provider';
  const year = new Date(now).getFullYear();
  const seriesPrefix = `${draft.template}C${String(year).slice(-2)}M`;
  const sampleCode = buildCashRegisterCode({
    template: draft.template,
    issuedAt: now,
    taxAuthorityPrefix: draft.taxAuthorityPrefix || 'XXXXX',
    terminalCode: draft.terminalCode || '01',
    sequence: 1,
  });
  const previewReceipt = buildSampleEInvoiceReceipt(
    { ...settings, eInvoice: draft },
    now,
  );

  function copyStoreInfo() {
    update({
      sellerName: store.name,
      sellerTaxCode: store.taxCode,
      sellerAddress: store.address,
      sellerPhone: store.phone,
    });
  }

  function changeProvider(providerId: EInvoiceProviderId) {
    const nextProvider = getEInvoiceProvider(providerId);
    // Trang tra cứu còn là trang mặc định của nhà cung cấp cũ thì đổi theo nhà cung cấp mới.
    const lookupUrl =
      draft.lookupUrl === provider.lookupUrl
        ? nextProvider.lookupUrl
        : draft.lookupUrl;
    update({ providerId, lookupUrl });
  }

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.eInvoice}
      status={status}
      form={form}
      actions={
        <Button
          variant="secondary"
          size="sm"
          disabled={
            !draft.enabled || settings.printer.mode === 'none' || isPrinting
          }
          onClick={() => testPrint(draft)}
        >
          <PrinterCheck className="size-4" />
          {isPrinting ? 'Đang in…' : 'In thử hóa đơn'}
        </Button>
      }
    >
      <SettingsSwitchRow
        label="Lập hóa đơn điện tử"
        description="Hóa đơn khởi tạo từ máy tính tiền có mã của cơ quan thuế, bắt buộc với dịch vụ ăn uống."
        checked={draft.enabled}
        onChange={(enabled) => update({ enabled })}
      />

      {provider.isSandbox && (
        <SettingsNote
          tone="warning"
          title="Đang chạy thử nghiệm, chưa gửi cơ quan thuế"
        >
          Hóa đơn vẫn được lập, đánh số, tính thuế và in đầy đủ nhưng chưa có
          giá trị pháp lý. Khi đã đăng ký dùng hóa đơn khởi tạo từ máy tính tiền
          với cơ quan thuế và có tài khoản tích hợp MISA meInvoice, chọn MISA ở
          mục “Phát hành qua”.
        </SettingsNote>
      )}

      {draft.enabled && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <ChoiceCards
              label="Phát hành qua"
              options={EINVOICE_PROVIDER_OPTIONS}
              value={draft.providerId}
              onChange={changeProvider}
            />

            {draft.providerId === 'misa' && (
              <MisaConnectionPanel
                currentSymbol={`${seriesPrefix}${draft.seriesSuffix}`}
                sellerTaxCode={draft.sellerTaxCode.replace(/\s/g, '')}
                year={year}
                onSelectSeries={(template, seriesSuffix) =>
                  update({ template, seriesSuffix })
                }
              />
            )}

            <ChoiceCards
              label="Loại hóa đơn"
              options={EINVOICE_TEMPLATE_OPTIONS}
              value={draft.template}
              onChange={(template) => update({ template })}
            />

            <section
              aria-labelledby="einvoice-seller-title"
              className="flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  id="einvoice-seller-title"
                  className="text-sm font-semibold"
                >
                  Người bán theo đăng ký thuế
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!store.name}
                  onClick={copyStoreInfo}
                >
                  <Store className="size-4" />
                  Lấy từ thông tin cửa hàng
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Tên người bán" htmlFor="einvoice-seller-name">
                    <input
                      id="einvoice-seller-name"
                      maxLength={120}
                      placeholder="Hộ kinh doanh Nguyễn Văn A"
                      value={draft.sellerName}
                      onChange={(event) =>
                        update({ sellerName: event.target.value })
                      }
                      className={INPUT_CLASS_NAME}
                    />
                  </Field>
                </div>
                <Field label="Mã số thuế" htmlFor="einvoice-seller-tax-code">
                  <input
                    id="einvoice-seller-tax-code"
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="0101234567"
                    value={draft.sellerTaxCode}
                    onChange={(event) =>
                      update({ sellerTaxCode: event.target.value })
                    }
                    className={cn(INPUT_CLASS_NAME, 'font-mono')}
                  />
                </Field>
                <Field label="Số điện thoại" htmlFor="einvoice-seller-phone">
                  <input
                    id="einvoice-seller-phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="Không bắt buộc"
                    value={draft.sellerPhone}
                    onChange={(event) =>
                      update({ sellerPhone: event.target.value })
                    }
                    className={INPUT_CLASS_NAME}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Địa chỉ" htmlFor="einvoice-seller-address">
                    <input
                      id="einvoice-seller-address"
                      autoComplete="street-address"
                      maxLength={160}
                      value={draft.sellerAddress}
                      onChange={(event) =>
                        update({ sellerAddress: event.target.value })
                      }
                      className={INPUT_CLASS_NAME}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="einvoice-series-title"
              className="flex flex-col gap-3"
            >
              <h3 id="einvoice-series-title" className="text-sm font-semibold">
                Ký hiệu và mã hóa đơn
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Ký hiệu hóa đơn"
                  htmlFor="einvoice-series-suffix"
                  hint={
                    usesProviderNumbering
                      ? `Trùng ký hiệu đã đăng ký trên ${provider.label}.`
                      : '2 chữ cái tự đặt, mỗi máy bán hàng một ký hiệu.'
                  }
                >
                  <div className="flex">
                    <span className="inline-flex h-11 shrink-0 items-center rounded-l-xl border border-r-0 border-line bg-surface-muted px-3 font-mono text-[15px] text-ink-soft">
                      {seriesPrefix}
                    </span>
                    <input
                      id="einvoice-series-suffix"
                      maxLength={2}
                      autoComplete="off"
                      spellCheck={false}
                      value={draft.seriesSuffix}
                      onChange={(event) =>
                        update({
                          seriesSuffix: event.target.value.toUpperCase(),
                        })
                      }
                      className={cn(
                        INPUT_CLASS_NAME,
                        'min-w-0 rounded-l-none font-mono',
                      )}
                    />
                  </div>
                </Field>
                {!usesProviderNumbering && (
                  <>
                    <Field
                      label="Mã cơ quan thuế cấp"
                      htmlFor="einvoice-tax-authority-prefix"
                      hint="5 ký tự trong thông báo chấp nhận đăng ký."
                    >
                      <input
                        id="einvoice-tax-authority-prefix"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="AB12C"
                        value={draft.taxAuthorityPrefix}
                        onChange={(event) =>
                          update({
                            taxAuthorityPrefix: toTaxAuthorityPrefix(
                              event.target.value,
                            ),
                          })
                        }
                        className={cn(INPUT_CLASS_NAME, 'font-mono')}
                      />
                    </Field>
                    <Field
                      label="Số hiệu máy"
                      htmlFor="einvoice-terminal-code"
                      hint="01–99, mỗi máy một số để mã không trùng."
                    >
                      <input
                        id="einvoice-terminal-code"
                        inputMode="numeric"
                        autoComplete="off"
                        value={draft.terminalCode}
                        onChange={(event) =>
                          update({
                            terminalCode: toTerminalCode(event.target.value),
                          })
                        }
                        className={cn(INPUT_CLASS_NAME, 'font-mono')}
                      />
                    </Field>
                  </>
                )}
              </div>
              {usesProviderNumbering && (
                <p className="text-xs text-ink-soft">
                  Số hóa đơn, mã của cơ quan thuế và mã tra cứu do{' '}
                  {provider.label} cấp khi phát hành, ngay lúc thanh toán.
                </p>
              )}
              {!usesProviderNumbering && (
                <p className="text-xs text-ink-soft">
                  Mã của cơ quan thuế trên hóa đơn đầu tiên:{' '}
                  <span className="font-mono font-semibold break-all text-ink">
                    {sampleCode}
                  </span>
                </p>
              )}
            </section>

            {draft.template === '1' && (
              <Field
                label="Thuế suất GTGT mặc định"
                htmlFor="einvoice-default-vat"
                hint="Dịch vụ ăn uống được giảm còn 8% đến hết 31/12/2026 (Nghị định 174/2025/NĐ-CP). Bia, rượu vẫn 10%: đặt riêng trong từng món."
              >
                <select
                  id="einvoice-default-vat"
                  value={draft.defaultVatRate}
                  onChange={(event) =>
                    update({
                      defaultVatRate: toVatRateCode(
                        event.target.value,
                        draft.defaultVatRate,
                      ),
                    })
                  }
                  className={INPUT_CLASS_NAME}
                >
                  {VAT_RATE_CODES.map((code) => (
                    <option key={code} value={code}>
                      {VAT_RATE_LABELS[code]}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <SettingsSwitchRow
              label="Tự lập hóa đơn cho mọi đơn"
              description="Nghị định 70/2025/NĐ-CP yêu cầu lập hóa đơn cho từng lần bán, kể cả khi khách không lấy. Khi tắt, chỉ lập cho khách có nhập thông tin người mua."
              checked={draft.autoIssueOnPayment}
              onChange={(autoIssueOnPayment) => update({ autoIssueOnPayment })}
            />

            <Field
              label="Trang tra cứu hóa đơn"
              htmlFor="einvoice-lookup-url"
              hint="In ở cuối hóa đơn để người mua tra cứu bằng mã của cơ quan thuế hoặc mã tra cứu."
            >
              <input
                id="einvoice-lookup-url"
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                value={draft.lookupUrl}
                onChange={(event) => update({ lookupUrl: event.target.value })}
                className={cn(INPUT_CLASS_NAME, 'font-mono text-sm')}
              />
            </Field>
          </div>
          <ReceiptPreview receipt={previewReceipt} />
        </div>
      )}
    </SettingsCard>
  );
}
