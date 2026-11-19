import type { BankTransferSettings } from '@/types/settings';

/** Đủ thông tin tài khoản nhận tiền để tạo mã VietQR. */
export function isBankTransferReady(settings: BankTransferSettings): boolean {
  return (
    settings.enabled &&
    settings.bankBin.length > 0 &&
    settings.accountNumber.length > 0
  );
}
