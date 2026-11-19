import type { Order } from './order';

/**
 * Thao tác trên một đơn đang xử lý ở màn bếp, do màn Đơn hàng thực hiện. Thao tác là `null` khi
 * nhân viên đang dùng máy không có quyền, để nút tương ứng được ẩn đi.
 */
export interface ActiveOrderActions {
  advance: (order: Order) => void;
  pay: ((order: Order) => void) | null;
  printBill: (order: Order) => void;
  printReceipt: (order: Order) => void;
  cancel: ((order: Order) => void) | null;
  addItems: (order: Order) => void;
  callPager: (order: Order) => void;
  completePickup: (order: Order) => void;
  assignPager: (order: Order) => void;
}
