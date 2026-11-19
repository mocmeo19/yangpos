import type {
  EInvoiceTemplate,
  EInvoiceTransmissionStatus,
} from '@/types/einvoice';

export const EINVOICE_TEMPLATE_TITLES: Record<EInvoiceTemplate, string> = {
  '1': 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
  '2': 'HÓA ĐƠN BÁN HÀNG',
};

export const EINVOICE_ORIGIN_NOTE = '(Khởi tạo từ máy tính tiền)';

export const EINVOICE_SANDBOX_NOTICE =
  'BẢN THỬ NGHIỆM – CHƯA GỬI CƠ QUAN THUẾ, KHÔNG CÓ GIÁ TRỊ PHÁP LÝ';

export const EINVOICE_TRANSMISSION_LABELS: Record<
  EInvoiceTransmissionStatus,
  string
> = {
  pending: 'Chờ gửi',
  sent: 'Đã gửi CQT',
  failed: 'Gửi lỗi',
  sandbox: 'Thử nghiệm',
};
