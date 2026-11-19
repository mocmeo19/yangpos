/** Dạng "43 41 4C 4C" để đối chiếu với bảng lệnh trong tài liệu của hãng đế phát. */
export function formatBytesHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) =>
    byte.toString(16).toUpperCase().padStart(2, '0'),
  ).join(' ');
}
