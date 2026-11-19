/** Phần chung của mọi phản hồi từ API MISA, đã chuẩn hóa tên trường. */
export interface MisaEnvelope {
  success: boolean;
  errorCode: string | null;
  errorDescription: string | null;
  /** MISA thường gói danh sách thành chuỗi JSON; giá trị ở đây đã được giải chuỗi nếu đọc được. */
  data: unknown;
  publishInvoiceResult: unknown;
}
