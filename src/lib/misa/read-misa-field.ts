/** Tài liệu MISA khi viết hoa, khi viết thường tên trường (Success/success) nên đọc không phân biệt. */
export function readMisaField(source: unknown, name: string): unknown {
  if (typeof source !== 'object' || source === null) {
    return undefined;
  }
  const wanted = name.toLowerCase();
  const key = Object.keys(source).find(
    (candidate) => candidate.toLowerCase() === wanted,
  );
  return key === undefined ? undefined : Reflect.get(source, key);
}

/** Chuỗi có nội dung, đã bỏ khoảng trắng hai đầu; các giá trị khác là `null`. */
export function readMisaText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const text = value.trim();
  return text.length > 0 ? text : null;
}
