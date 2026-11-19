import type { EInvoiceSeller, InvoiceBuyer } from '@/types/einvoice';

export function describeSellerLines(seller: EInvoiceSeller): string[] {
  const lines = [
    `Người bán: ${seller.name}`,
    `MST: ${seller.taxCode}`,
    `Địa chỉ: ${seller.address}`,
  ];
  if (seller.phone) {
    lines.push(`ĐT: ${seller.phone}`);
  }
  return lines;
}

/** Không có người mua nghĩa là khách lẻ không yêu cầu ghi thông tin lên hóa đơn. */
export function describeBuyerLines(buyer: InvoiceBuyer | null): string[] {
  if (!buyer) {
    return ['Người mua: Khách lẻ'];
  }
  const lines: string[] = [];
  if (buyer.kind === 'company') {
    lines.push(`Đơn vị mua: ${buyer.name}`, `MST: ${buyer.taxCode}`);
  } else {
    lines.push(`Người mua: ${buyer.name}`);
  }
  if (buyer.personalId) {
    lines.push(`Số định danh: ${buyer.personalId}`);
  }
  if (buyer.address) {
    lines.push(`Địa chỉ: ${buyer.address}`);
  }
  if (buyer.phone) {
    lines.push(`ĐT: ${buyer.phone}`);
  }
  return lines;
}
