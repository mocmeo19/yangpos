/** So sánh theo giá trị từng trường để không phụ thuộc thứ tự khóa khi đọc lại từ máy chủ. */
export function areSettingsEqual(first: object, second: object): boolean {
  const firstEntries = Object.entries(first);
  if (firstEntries.length !== Object.keys(second).length) {
    return false;
  }
  return firstEntries.every(
    ([key, value]) =>
      JSON.stringify(value) === JSON.stringify(Reflect.get(second, key)),
  );
}
