/** Một lượt đặt giữ bàn trong khoảng này trước và sau giờ hẹn; lượt khác trên cùng bàn phải cách ra. */
export const RESERVATION_HOLD_MS = 2 * 60 * 60 * 1000;

/** Quá giờ hẹn chừng này mà khách chưa tới thì báo trễ để nhân viên gọi xác nhận. */
export const RESERVATION_LATE_AFTER_MS = 15 * 60 * 1000;

/** Thẻ bàn báo trước lượt đặt sắp tới trong khoảng này để không xếp khách vãng lai vào. */
export const RESERVATION_UPCOMING_WINDOW_MS = 3 * 60 * 60 * 1000;
