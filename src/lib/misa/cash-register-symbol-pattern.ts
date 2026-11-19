/**
 * Mẫu số ghép ký hiệu của hóa đơn khởi tạo từ máy tính tiền theo cách MISA ghi, vd "1C26MAA": mẫu
 * số 1 hoặc 2, "C" (có mã), 2 số cuối của năm, "M" (máy tính tiền), 2 chữ cái người bán tự đặt.
 */
export const CASH_REGISTER_SYMBOL_PATTERN = /^[12]C\d{2}M[A-Z]{2}$/;
