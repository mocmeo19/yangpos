import type { AppSettings } from '@/types/settings';

export const DEFAULT_SETTINGS: AppSettings = {
  store: {
    name: '',
    address: '',
    phone: '',
    taxCode: '',
    wifiName: '',
    wifiPassword: '',
    receiptFooter: 'Cảm ơn quý khách, hẹn gặp lại!',
  },
  eInvoice: {
    enabled: false,
    template: '1',
    seriesSuffix: 'AA',
    taxAuthorityPrefix: '',
    terminalCode: '01',
    sellerName: '',
    sellerTaxCode: '',
    sellerAddress: '',
    sellerPhone: '',
    // Dịch vụ ăn uống được giảm từ 10% còn 8% đến hết 31/12/2026 (Nghị định 174/2025/NĐ-CP).
    defaultVatRate: '8',
    autoIssueOnPayment: true,
    providerId: 'sandbox',
    lookupUrl: 'https://hoadondientu.gdt.gov.vn',
  },
  printer: {
    mode: 'browser',
    paperWidth: 80,
    networkHost: '',
    networkPort: 9100,
    copies: 1,
    autoPrintAfterPayment: false,
  },
  cashDrawer: {
    enabled: false,
    openOnCashPayment: true,
  },
  pager: {
    enabled: false,
    // Bộ Retekess TD157 tiêu chuẩn có 16 thẻ, ghép thêm được tới 998 thẻ.
    model: 'retekess-td157',
    pagerCount: 16,
    connection: 'manual',
    baudRate: 9600,
    commandTemplate: '',
    autoCallWhenReady: true,
  },
  bankTransfer: {
    enabled: true,
    bankBin: '',
    accountNumber: '',
    accountName: '',
    notePrefix: 'YANGPOS',
    showQrOnReceipt: true,
  },
  cardPayment: {
    enabled: true,
    acceptedBrands: ['visa', 'mastercard', 'jcb', 'napas'],
    terminalName: '',
    terminalId: '',
    merchantId: '',
    requireApprovalCode: false,
  },
  scanner: {
    enabled: true,
    terminator: 'Enter',
    maxKeyIntervalMs: 50,
    minLength: 4,
  },
};
