/** Bỏ khoảng trắng người dùng gõ để chia nhóm số, vd "0123 456 789". */
export function normalizeAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/\s+/g, '').toUpperCase();
}
