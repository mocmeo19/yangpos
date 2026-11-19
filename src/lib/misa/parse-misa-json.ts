/** MISA gói danh sách thành chuỗi JSON trong trường data; chuỗi không phải JSON (vd token) giữ nguyên. */
export function parseMisaJson(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
