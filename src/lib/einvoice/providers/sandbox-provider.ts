import type { EInvoiceProvider } from '@/types/einvoice-provider';

/** Chỉ đánh dấu hóa đơn là thử nghiệm; số và mã cấp ngay trên máy, không có dữ liệu nào rời khỏi máy. */
export const SANDBOX_PROVIDER: EInvoiceProvider = {
  id: 'sandbox',
  label: 'Thử nghiệm',
  isSandbox: true,
  numbering: 'local',
  lookupUrl: 'https://hoadondientu.gdt.gov.vn',
  transmit: async () => ({
    status: 'sandbox',
    message: 'Chế độ thử nghiệm: dữ liệu chưa được gửi tới cơ quan thuế.',
    assignment: null,
  }),
};
