import type { VatRateCode } from './einvoice';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  emoji: string;
  isAvailable: boolean;
  createdAt: number;
  /** Mã vạch hoặc SKU để thêm món bằng máy quét; bỏ trống khi món không có mã. */
  barcode?: string;
  /** Đơn vị tính in trên hóa đơn điện tử; bỏ trống thì dùng "Phần". */
  unit?: string;
  /** Thuế suất GTGT riêng của món (vd bia 10%); bỏ trống thì dùng thuế suất mặc định. */
  vatRate?: VatRateCode;
}

export type MenuItemInput = Omit<MenuItem, 'id' | 'createdAt'>;
