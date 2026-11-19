/**
 * Lỗi nghiệp vụ có thông báo dành cho người dùng (vd "Bàn đang có đơn"). API trả nguyên thông báo
 * này; mọi lỗi khác bị ẩn sau thông báo chung để không lộ chi tiết hệ thống.
 */
export class UserFacingError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'UserFacingError';
    this.status = status;
  }
}
