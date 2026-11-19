import 'server-only';
import { DEMO_CREDENTIALS } from './demo-credentials';
import { safeEqual } from './safe-equal';

// Ứng dụng chưa có backend lưu người dùng nên chỉ hỗ trợ một tài khoản dùng thử cố định.
export function verifyDemoCredentials(
  username: string,
  password: string,
): boolean {
  // Kiểm tra cả hai vế trước khi kết luận để thời gian xử lý không lộ việc sai tên hay sai mật khẩu.
  const isUsernameValid = safeEqual(username, DEMO_CREDENTIALS.username);
  const isPasswordValid = safeEqual(password, DEMO_CREDENTIALS.password);
  return isUsernameValid && isPasswordValid;
}
