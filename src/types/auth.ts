export interface LoginFormState {
  error: string | null;
  /** Giữ lại tên đăng nhập để người dùng không phải gõ lại khi sai mật khẩu. */
  username: string;
}
