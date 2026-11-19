// Chia nhỏ để không vượt giới hạn số tham số khi gọi String.fromCharCode với mảng lớn.
const CHUNK_SIZE = 0x8000;

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let index = 0; index < bytes.length; index += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK_SIZE));
  }
  return btoa(binary);
}
