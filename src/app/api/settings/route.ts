import { apiRoute } from '@/server/api/api-route';
import { requireShopSession } from '@/server/auth/require-staff';
import { getStoredSettings } from '@/server/repositories/settings-repository';

/** Các phần cài đặt đã lưu; phần chưa lưu do trình duyệt ghép với giá trị mặc định. */
export const GET = apiRoute(async () => {
  await requireShopSession();
  return getStoredSettings();
});
