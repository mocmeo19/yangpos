/** Chữ cái đầu của họ và tên (vd "Nguyễn Văn An" → "NA") để phân biệt người trùng tên gọi. */
export function getStaffInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '?';
  }
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';
  return `${first}${last}`.toLocaleUpperCase('vi');
}
