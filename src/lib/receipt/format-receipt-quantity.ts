import { formatCurrency } from '@/lib/format-currency';
import type { ReceiptLine } from '@/types/receipt';

/** Dòng số lượng dưới tên món, vd "2 x 55.000 ₫"; hóa đơn điện tử ghi thêm đơn vị tính: "2 phần x 55.000 ₫". */
export function formatReceiptQuantity(line: ReceiptLine): string {
  const unit = line.unit ? ` ${line.unit.toLocaleLowerCase('vi-VN')}` : '';
  return `${line.quantity}${unit} x ${formatCurrency(line.unitPrice)}`;
}
