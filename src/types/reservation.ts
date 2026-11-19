export type ReservationStatus = 'booked' | 'seated' | 'cancelled' | 'noShow';

export interface Reservation {
  id: string;
  customerName: string;
  /** Có thể để trống khi khách đặt trực tiếp tại quán. */
  phone: string;
  partySize: number;
  reservedAt: number;
  /** `null` khi chưa xếp bàn, sẽ chọn bàn lúc khách tới. */
  tableId: string | null;
  note: string;
  status: ReservationStatus;
  createdAt: number;
}

export type ReservationInput = Pick<
  Reservation,
  'customerName' | 'phone' | 'partySize' | 'reservedAt' | 'tableId' | 'note'
>;
