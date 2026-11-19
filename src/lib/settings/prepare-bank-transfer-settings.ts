import { normalizeAccountNumber } from '@/lib/normalize-account-number';
import {
  MAX_TRANSFER_NOTE_PREFIX_LENGTH,
  toBankText,
} from '@/lib/transfer-note';
import type { BankTransferSettings } from '@/types/settings';

const ACCOUNT_NUMBER_PATTERN = /^[A-Z0-9]{4,19}$/;

/**
 * Cho phép để trống cả ngân hàng lẫn số tài khoản: khi đó vẫn nhận chuyển khoản nhưng không có
 * mã QR. Đã nhập một trong hai thì phải nhập đủ và đúng để mã QR không chuyển nhầm tiền.
 */
export function prepareBankTransferSettings(
  bankTransfer: BankTransferSettings,
): BankTransferSettings {
  const prepared: BankTransferSettings = {
    ...bankTransfer,
    accountNumber: normalizeAccountNumber(bankTransfer.accountNumber),
    accountName: toBankText(bankTransfer.accountName),
    notePrefix: toBankText(bankTransfer.notePrefix).slice(
      0,
      MAX_TRANSFER_NOTE_PREFIX_LENGTH,
    ),
  };
  const hasBank = prepared.bankBin.length > 0;
  const hasAccount = prepared.accountNumber.length > 0;
  if (!prepared.enabled || (!hasBank && !hasAccount)) {
    return prepared;
  }
  if (!hasBank) {
    throw new Error('Chọn ngân hàng của tài khoản nhận tiền.');
  }
  if (!ACCOUNT_NUMBER_PATTERN.test(prepared.accountNumber)) {
    throw new Error(
      'Số tài khoản gồm 4–19 chữ số hoặc chữ cái, không có dấu cách.',
    );
  }
  return prepared;
}
