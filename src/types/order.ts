export type OrderStatus =
  'pending' | 'preparing' | 'served' | 'paid' | 'cancelled';

export type PaymentMethod = 'cash' | 'transfer' | 'card';

export type ServiceMode = 'dineIn' | 'takeaway';

export type CardBrand = 'visa' | 'mastercard' | 'jcb' | 'amex' | 'napas';

/** Tên và đơn giá được chụp lại lúc gọi món để đơn cũ không đổi khi thực đơn thay đổi. */
export interface OrderItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note: string;
}

/** Thông tin đối soát của lần thanh toán, in lại trên hóa đơn. */
export interface PaymentDetails {
  cashReceived?: number;
  cardBrand?: CardBrand;
  cardLast4?: string;
  approvalCode?: string;
  transferNote?: string;
}

export interface PaymentInput {
  method: PaymentMethod;
  details: PaymentDetails;
}

export interface Order {
  id: string;
  number: number;
  /** `null` nghĩa là đơn mang đi. */
  tableId: string | null;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: number;
  updatedAt: number;
  paidAt: number | null;
  paymentMethod: PaymentMethod | null;
  /** Chỉ có ở đơn thanh toán sau khi bổ sung phần cài đặt thanh toán. */
  paymentDetails?: PaymentDetails;
  /** Số thẻ rung đưa cho khách tự phục vụ; đơn có thẻ chỉ đóng khi khách đã nhận món. */
  pagerNumber?: number;
  /** Lần gần nhất gọi thẻ rung, để biết đơn đang chờ khách tới lấy. */
  pagerCalledAt?: number;
}

export interface PlaceOrderInput {
  tableId: string | null;
  items: OrderItem[];
  /** Chỉ dùng cho đơn không có bàn (mang đi, tại quầy). */
  pagerNumber: number | null;
}
