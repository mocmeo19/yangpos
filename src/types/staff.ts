export type Permission =
  | 'pos.sell'
  | 'orders.view'
  | 'orders.pay'
  | 'orders.cancel'
  | 'tables.manage'
  | 'menu.manage'
  | 'reports.view'
  | 'finance.manage'
  | 'settings.manage'
  | 'staff.manage';

export interface StaffRole {
  id: string;
  name: string;
  /** Vai trò chủ cửa hàng luôn có toàn quyền nên danh sách này bị bỏ qua với vai trò đó. */
  permissions: Permission[];
  sortOrder: number;
}

export type StaffRoleInput = Pick<StaffRole, 'name' | 'permissions'>;

/** PIN không lưu dạng rõ: chỉ giữ muối và kết quả băm PBKDF2, đều ở dạng base64. */
export interface PinCredential {
  salt: string;
  hash: string;
}

/** Thông tin nhân viên gửi xuống trình duyệt; mã PIN đã băm chỉ nằm trên server. */
export interface Employee {
  id: string;
  name: string;
  roleId: string;
  isActive: boolean;
  createdAt: number;
  /** Chủ cửa hàng còn dùng PIN tạo sẵn lúc cài đặt, cần nhắc đổi. */
  usesDefaultPin: boolean;
}

/** Bản ghi lưu trong database. */
export interface EmployeeRecord extends Omit<Employee, 'usesDefaultPin'> {
  pin: PinCredential;
}

export interface EmployeeInput {
  name: string;
  roleId: string;
  isActive: boolean;
  /** Bắt buộc khi thêm mới; để trống khi sửa nghĩa là giữ PIN cũ. */
  pin: string;
}

export interface PermissionOption {
  value: Permission;
  label: string;
  description: string;
}

export interface PermissionGroup {
  title: string;
  permissions: readonly PermissionOption[];
}

export type StaffSession =
  | { status: 'loading' }
  | { status: 'locked' }
  | { status: 'unlocked'; employee: Employee; role: StaffRole };

/** Nhân viên đang thao tác, để chặn tự khóa mình hoặc vượt quyền chủ cửa hàng. */
export interface StaffActor {
  employeeId: string;
  roleId: string;
}

/** Nhân viên đang mở khóa máy, do API phiên nhân viên trả về. */
export interface StaffSessionInfo {
  employee: Employee;
  role: StaffRole;
}
