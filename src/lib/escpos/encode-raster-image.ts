import { concatBytes } from '@/lib/bytes/concat-bytes';
import { rasterImageHeader } from './commands';

// Nhiều máy in giới hạn chiều cao mỗi lệnh ảnh nên chia hóa đơn thành từng dải.
const BAND_HEIGHT = 255;
// Điểm có độ sáng thấp hơn ngưỡng được in đen; ngưỡng hơi cao giúp chữ khử răng cưa vẫn đậm nét.
const DARKNESS_THRESHOLD = 160;

function isDarkPixel(data: Uint8ClampedArray, offset: number): boolean {
  const luminance =
    0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2];
  return luminance < DARKNESS_THRESHOLD;
}

/** Chuyển ảnh hóa đơn thành lệnh in raster ESC/POS (mỗi điểm 1 bit). */
export function encodeRasterImage(image: ImageData): Uint8Array {
  const bytesPerRow = Math.ceil(image.width / 8);
  const bands: Uint8Array[] = [];

  for (let top = 0; top < image.height; top += BAND_HEIGHT) {
    const rows = Math.min(BAND_HEIGHT, image.height - top);
    const bits = new Uint8Array(bytesPerRow * rows);

    for (let row = 0; row < rows; row += 1) {
      for (let x = 0; x < image.width; x += 1) {
        const offset = ((top + row) * image.width + x) * 4;
        if (isDarkPixel(image.data, offset)) {
          bits[row * bytesPerRow + (x >> 3)] |= 0x80 >> (x & 7);
        }
      }
    }

    bands.push(rasterImageHeader(bytesPerRow, rows), bits);
  }

  return concatBytes(bands);
}
