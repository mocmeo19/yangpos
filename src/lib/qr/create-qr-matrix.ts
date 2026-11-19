import QRCode from 'qrcode';

export interface QrMatrix {
  size: number;
  isDark: (row: number, column: number) => boolean;
}

/** Ma trận điểm của mã QR, dùng chung cho bản vẽ SVG trên màn hình và bản vẽ canvas khi in. */
export function createQrMatrix(payload: string): QrMatrix {
  const { modules } = QRCode.create(payload, { errorCorrectionLevel: 'M' });
  return {
    size: modules.size,
    isDark: (row, column) => modules.get(row, column) === 1,
  };
}
