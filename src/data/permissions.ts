import type {
  Permission,
  PermissionGroup,
  PermissionOption,
} from '@/types/staff';

export const PERMISSION_GROUPS: readonly PermissionGroup[] = [
  {
    title: 'Bán hàng và đơn',
    permissions: [
      {
        value: 'pos.sell',
        label: 'Bán hàng',
        description: 'Gọi món, gửi bếp, xem sơ đồ bàn',
      },
      {
        value: 'orders.view',
        label: 'Xem và xử lý đơn',
        description: 'Màn bếp, chuyển trạng thái món, lịch sử đơn',
      },
      {
        value: 'orders.pay',
        label: 'Thu tiền',
        description: 'Thanh toán đơn bằng tiền mặt, chuyển khoản, thẻ',
      },
      {
        value: 'orders.cancel',
        label: 'Hủy đơn',
        description: 'Hủy đơn chưa thanh toán',
      },
    ],
  },
  {
    title: 'Quản lý cửa hàng',
    permissions: [
      {
        value: 'tables.manage',
        label: 'Quản lý bàn',
        description: 'Thêm, sửa, xóa bàn',
      },
      {
        value: 'menu.manage',
        label: 'Quản lý thực đơn',
        description: 'Món, giá, danh mục, mã vạch',
      },
      {
        value: 'reports.view',
        label: 'Xem báo cáo',
        description: 'Doanh thu và món bán chạy',
      },
      {
        value: 'finance.manage',
        label: 'Tài chính',
        description: 'Sổ quỹ, lãi lỗ, hóa đơn điện tử',
      },
    ],
  },
  {
    title: 'Quản trị',
    permissions: [
      {
        value: 'settings.manage',
        label: 'Cài đặt',
        description: 'Thông tin cửa hàng, thiết bị, thanh toán',
      },
      {
        value: 'staff.manage',
        label: 'Nhân viên và phân quyền',
        description: 'Thêm nhân viên, đổi PIN, sửa vai trò',
      },
    ],
  },
];

export const PERMISSION_OPTIONS: readonly PermissionOption[] =
  PERMISSION_GROUPS.flatMap((group) => group.permissions);

export const ALL_PERMISSIONS: readonly Permission[] = PERMISSION_OPTIONS.map(
  (option) => option.value,
);
