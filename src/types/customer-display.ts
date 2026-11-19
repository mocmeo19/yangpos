/** Một món khách đang chọn, chỉ gồm thông tin cần hiển thị cho khách. */
export interface CustomerDisplayLine {
  menuItemId: string;
  name: string;
  emoji: string;
  quantity: number;
  unitPrice: number;
  note: string;
}

export interface CustomerDisplaySnapshot {
  lines: CustomerDisplayLine[];
  /** Tên bàn hoặc "Mang đi"; rỗng khi chưa chọn bàn. */
  destinationLabel: string;
}

export type CustomerDisplayMessage =
  | { type: 'snapshot'; snapshot: CustomerDisplaySnapshot }
  /** Màn hình khách vừa mở, xin máy bán hàng gửi lại phiếu hiện tại. */
  | { type: 'request' };

export interface AdSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: 'amber' | 'rose' | 'sage';
}
