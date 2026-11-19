import type { Receipt } from '@/types/receipt';
import type { PaperWidth } from '@/types/settings';
import { drawReceipt } from './draw-receipt';
import { ReceiptCanvasWriter } from './receipt-canvas-writer';

// Máy in nhiệt 203 dpi: khổ 80mm in được 576 điểm, khổ 58mm in được 384 điểm.
const PRINTABLE_DOTS: Record<PaperWidth, number> = { 58: 384, 80: 576 };
const REFERENCE_DOTS = PRINTABLE_DOTS[80];
const MAX_HEIGHT_DOTS = 8000;
const SIDE_MARGIN_DOTS = 8;
const BOTTOM_MARGIN_DOTS = 24;

/** Dùng đúng phông chữ của ứng dụng để tiếng Việt có dấu hiển thị chuẩn trên giấy in. */
async function resolveFontFamily(): Promise<string> {
  await document.fonts.ready;
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-be-vietnam-pro')
    .trim();
  return family || 'sans-serif';
}

/**
 * Vẽ hóa đơn thành ảnh đen trắng thay vì gửi chữ, vì phần lớn máy in nhiệt không có bảng mã
 * tiếng Việt.
 */
export async function renderReceiptBitmap(
  receipt: Receipt,
  paperWidth: PaperWidth,
): Promise<ImageData> {
  const width = PRINTABLE_DOTS[paperWidth];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = MAX_HEIGHT_DOTS;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Trình duyệt không hỗ trợ vẽ hóa đơn để in.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, MAX_HEIGHT_DOTS);
  context.fillStyle = '#000000';
  context.textBaseline = 'top';
  context.translate(SIDE_MARGIN_DOTS, 0);

  const writer = new ReceiptCanvasWriter(
    context,
    width - SIDE_MARGIN_DOTS * 2,
    await resolveFontFamily(),
  );
  drawReceipt(writer, receipt, width / REFERENCE_DOTS);

  const height = Math.min(writer.height + BOTTOM_MARGIN_DOTS, MAX_HEIGHT_DOTS);
  return context.getImageData(0, 0, width, height);
}
