import type { EInvoice } from '@/types/einvoice';
import type { Order } from '@/types/order';
import type { EInvoiceSettings } from '@/types/settings';
import { buildCashRegisterCode } from './build-cash-register-code';
import { buildEInvoiceContent } from './build-einvoice-content';
import { buildEInvoiceSeries } from './build-einvoice-series';
import { getEInvoiceProvider } from './providers/get-einvoice-provider';

const SAMPLE_LOOKUP_CODE = 'XXXXXXXXXX';

/**
 * Hóa đơn mẫu để xem trước và in thử bố cục: không lưu, không cấp số thật và luôn ghi là thử
 * nghiệm. Trường còn trống được điền chữ giữ chỗ để thấy rõ vị trí trên giấy.
 */
export function buildSampleEInvoice(
  order: Order,
  settings: EInvoiceSettings,
  now: number,
): EInvoice {
  const sampleSettings: EInvoiceSettings = {
    ...settings,
    sellerName: settings.sellerName.trim() || 'Tên người bán',
    sellerTaxCode: settings.sellerTaxCode.trim() || '0000000000',
    sellerAddress: settings.sellerAddress.trim() || 'Địa chỉ người bán',
  };
  const content = buildEInvoiceContent({
    order,
    buyer: null,
    settings: sampleSettings,
    menuItems: new Map(),
    isSandbox: true,
  });
  const provider = getEInvoiceProvider(settings.providerId);
  return {
    ...content,
    id: 'sample-einvoice',
    providerId: provider.id,
    series: buildEInvoiceSeries(
      now,
      settings.seriesSuffix.trim().toUpperCase() || 'AA',
    ),
    number: 1,
    taxAuthorityCode: buildCashRegisterCode({
      template: settings.template,
      issuedAt: now,
      taxAuthorityPrefix:
        settings.taxAuthorityPrefix.trim().toUpperCase() || 'XXXXX',
      terminalCode: settings.terminalCode.trim() || '01',
      sequence: 1,
    }),
    // Nhà cung cấp cấp số lúc phát hành thì cũng cấp mã tra cứu; in chữ giữ chỗ để thấy vị trí.
    lookupCode: provider.numbering === 'provider' ? SAMPLE_LOOKUP_CODE : null,
    issuedAt: now,
    transmission: { status: 'sandbox', attemptedAt: null, message: null },
  };
}
