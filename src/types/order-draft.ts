import type { Dispatch } from 'react';
import type { CartAction, CartLine } from './cart';
import type { ServiceMode } from './order';

export interface OrderDraft {
  lines: CartLine[];
  dispatch: Dispatch<CartAction>;
  serviceMode: ServiceMode;
  setServiceMode: (serviceMode: ServiceMode) => void;
  selectedTableId: string | null;
  /** Chọn bàn đồng thời chuyển sang phục vụ tại bàn. */
  selectTable: (tableId: string) => void;
  /** Số thẻ rung sẽ đưa khách khi bán mang đi; `null` khi không dùng thẻ. */
  pagerNumber: number | null;
  setPagerNumber: (pagerNumber: number | null) => void;
  /** Bỏ món, bỏ chọn bàn và thẻ rung sau khi gửi đơn, giữ nguyên hình thức phục vụ. */
  resetDraft: () => void;
}
