/** Đường dẫn gốc của từng tài nguyên; dùng chung cho hook đọc dữ liệu và việc tải lại sau khi ghi. */
export const API_PATHS = {
  categories: '/api/categories',
  menuItems: '/api/menu-items',
  tables: '/api/tables',
  orders: '/api/orders',
  einvoices: '/api/einvoices',
  reports: '/api/reports',
  finance: '/api/finance',
  cashEntries: '/api/cash-entries',
  settings: '/api/settings',
  staffRoles: '/api/staff-roles',
  employees: '/api/employees',
  staffSession: '/api/staff-session',
  reservations: '/api/reservations',
} as const;

/** Mọi thứ phụ thuộc vào đơn hàng: danh sách đơn, hóa đơn của đơn, báo cáo, sổ quỹ. */
export const ORDER_DEPENDENT_PATHS = [
  API_PATHS.orders,
  API_PATHS.reports,
  API_PATHS.finance,
] as const;

export function rangeQuery(start: number, end: number): string {
  return `start=${start}&end=${end}`;
}
