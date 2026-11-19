/** Bỏ dấu tiếng Việt để tìm "pho" vẫn ra "Phở". */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}
