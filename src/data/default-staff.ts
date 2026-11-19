import type { PinCredential, StaffRole } from '@/types/staff';

/** Mã cố định để nhận ra vai trò chủ cửa hàng: luôn có toàn quyền, không sửa hay xóa được. */
export const OWNER_ROLE_ID = 'owner';

export const DEFAULT_STAFF_ROLES: readonly StaffRole[] = [
  { id: OWNER_ROLE_ID, name: 'Chủ cửa hàng', permissions: [], sortOrder: 0 },
  {
    id: 'manager',
    name: 'Quản lý',
    permissions: [
      'pos.sell',
      'orders.view',
      'orders.pay',
      'orders.cancel',
      'tables.manage',
      'menu.manage',
      'reports.view',
      'finance.manage',
    ],
    sortOrder: 1,
  },
  {
    id: 'cashier',
    name: 'Thu ngân',
    permissions: ['pos.sell', 'orders.view', 'orders.pay'],
    sortOrder: 2,
  },
  {
    id: 'waiter',
    name: 'Phục vụ',
    permissions: ['pos.sell', 'orders.view'],
    sortOrder: 3,
  },
  {
    id: 'kitchen',
    name: 'Bếp',
    permissions: ['orders.view'],
    sortOrder: 4,
  },
];

export const DEFAULT_OWNER_NAME = 'Chủ cửa hàng';
export const DEFAULT_OWNER_PIN = '0000';

/**
 * PBKDF2 của PIN mặc định, tính sẵn để dữ liệu mẫu tạo được ngay mà không phải băm lúc khởi động.
 */
export const DEFAULT_OWNER_PIN_CREDENTIAL: PinCredential = {
  salt: '9n6TCMqpU0K7DFuWfd4Ufw==',
  hash: 'uEbWq5pXU8QYSbT/rJisA8roRR/WGJAv8PzkAZiNOBg=',
};
