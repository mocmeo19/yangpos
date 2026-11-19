import { OWNER_ROLE_ID } from '@/data/default-staff';
import type { Permission, StaffRole } from '@/types/staff';

export function isOwnerRole(roleId: string): boolean {
  return roleId === OWNER_ROLE_ID;
}

/** Chủ cửa hàng luôn có mọi quyền, kể cả quyền được bổ sung ở phiên bản sau. */
export function hasPermission(
  role: StaffRole,
  permission: Permission,
): boolean {
  return isOwnerRole(role.id) || role.permissions.includes(permission);
}
