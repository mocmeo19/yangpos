// Trình duyệt chỉ bắt đầu đọc tệp sau khi sự kiện click kết thúc; thu hồi URL ngay thì tệp có thể rỗng.
const REVOKE_DELAY_MS = 10_000;

/** Lưu dữ liệu thành tệp trên máy người dùng, không cần đi qua máy chủ. */
export function downloadFile(
  data: BlobPart,
  fileName: string,
  mimeType: string,
): void {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  }
}
