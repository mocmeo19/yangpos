// Lệnh ESC/POS được hầu hết máy in hóa đơn nhiệt hỗ trợ (Epson, Xprinter, Antech…).

/** ESC @: đưa máy in về trạng thái mặc định trước mỗi lần in. */
export const ESC_POS_INITIALIZE = Uint8Array.of(0x1b, 0x40);

/** ESC p 0 t1 t2: phát xung mở két tiền nối vào cổng RJ11 (DK) của máy in. */
export const ESC_POS_OPEN_CASH_DRAWER = Uint8Array.of(
  0x1b,
  0x70,
  0x00,
  0x19,
  0xfa,
);

/** ESC d 4 rồi GS V 1: đẩy giấy 4 dòng và cắt một phần để dễ xé. */
export const ESC_POS_FEED_AND_CUT = Uint8Array.of(
  0x1b,
  0x64,
  0x04,
  0x1d,
  0x56,
  0x01,
);

/** GS v 0: tiêu đề của một khối ảnh raster, tiếp theo là dữ liệu điểm ảnh 1 bit. */
export function rasterImageHeader(
  bytesPerRow: number,
  rows: number,
): Uint8Array {
  return Uint8Array.of(
    0x1d,
    0x76,
    0x30,
    0x00,
    bytesPerRow & 0xff,
    bytesPerRow >> 8,
    rows & 0xff,
    rows >> 8,
  );
}
