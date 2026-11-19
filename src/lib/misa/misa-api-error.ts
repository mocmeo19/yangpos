/** Lỗi từ MISA kèm mã lỗi gốc để nơi gọi phân biệt được, vd token hết hạn thì đăng nhập lại. */
export class MisaApiError extends Error {
  readonly code: string | null;

  constructor(code: string | null, message: string) {
    super(message);
    this.name = 'MisaApiError';
    this.code = code;
  }
}
