import { menuItemInputSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody } from '@/server/api/api-route';
import { requireShopSession, requireStaff } from '@/server/auth/require-staff';
import {
  addMenuItem,
  listMenuItems,
} from '@/server/repositories/menu-item-repository';

// Màn hình khách chỉ có phiên cửa hàng, không có nhân viên, nên đọc thực đơn chỉ cần đăng nhập.
export const GET = apiRoute(async () => {
  await requireShopSession();
  return listMenuItems();
});

export const POST = apiRoute(async (request) => {
  await requireStaff('menu.manage');
  return addMenuItem(await readJsonBody(request, menuItemInputSchema));
});
