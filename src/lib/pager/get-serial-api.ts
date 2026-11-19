export const SERIAL_UNSUPPORTED_MESSAGE =
  'Trình duyệt này không kết nối được cổng USB/COM. Hãy dùng Chrome hoặc Edge trên máy tính.';

/** Web Serial chỉ có trên Chrome/Edge máy tính và cần trang chạy qua HTTPS hoặc localhost. */
export function getSerialApi(): Serial | null {
  return typeof navigator === 'undefined' ? null : (navigator.serial ?? null);
}
