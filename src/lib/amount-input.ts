const numberFormatter = new Intl.NumberFormat('vi-VN');

/** Lấy phần số từ chuỗi người dùng gõ, ví dụ "100.000" → 100000. */
export function parseAmountInput(text: string): number {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

export function formatAmountInput(amount: number): string {
  return amount > 0 ? numberFormatter.format(amount) : '';
}
