export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Đã có lỗi xảy ra, vui lòng thử lại.';
}
