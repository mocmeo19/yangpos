export interface RevenuePoint {
  key: string;
  /** Nhãn ngắn trên trục, vd "8h" hoặc "06/11". */
  label: string;
  /** Nhãn đầy đủ cho phần chi tiết và bảng số liệu. */
  fullLabel: string;
  value: number;
  orderCount: number;
}
