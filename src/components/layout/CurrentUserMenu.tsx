import { getCurrentUsername } from '@/lib/auth/current-user';
import { UserMenu } from './UserMenu';

/** Đọc phiên đăng nhập trên server; cần đặt trong `<Suspense>` vì phụ thuộc cookie của request. */
export async function CurrentUserMenu({ align }: { align: 'start' | 'end' }) {
  const username = await getCurrentUsername();
  if (!username) {
    return null;
  }
  return <UserMenu username={username} align={align} />;
}
