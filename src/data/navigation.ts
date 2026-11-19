import {
  CalendarClock,
  ChartColumn,
  ClipboardList,
  Settings,
  ShoppingBasket,
  UsersRound,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import type { NavigationItem } from '@/types/navigation';
import { DiningTableIcon } from '@/components/ui/DiningTableIcon';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/',
    label: 'Bán hàng',
    icon: ShoppingBasket,
    description: 'Gọi món, gửi bếp, thanh toán',
    permission: 'pos.sell',
  },
  {
    href: '/orders',
    label: 'Đơn hàng',
    icon: ClipboardList,
    description: 'Theo dõi bếp và lịch sử đơn',
    permission: 'orders.view',
  },
  {
    href: '/tables',
    label: 'Bàn',
    icon: DiningTableIcon,
    description: 'Sơ đồ bàn và khách đang ngồi',
    permission: 'pos.sell',
  },
  {
    href: '/reservations',
    label: 'Đặt bàn',
    icon: CalendarClock,
    description: 'Lịch khách đặt trước theo ngày',
    permission: 'pos.sell',
  },
  {
    href: '/menu',
    label: 'Thực đơn',
    icon: UtensilsCrossed,
    description: 'Món, giá, mã vạch, thuế suất',
    permission: 'menu.manage',
  },
  {
    href: '/reports',
    label: 'Báo cáo',
    icon: ChartColumn,
    description: 'Doanh thu và món bán chạy',
    permission: 'reports.view',
  },
  {
    href: '/finance',
    label: 'Tài chính',
    icon: Wallet,
    description: 'Sổ quỹ, lãi lỗ, hóa đơn điện tử',
    permission: 'finance.manage',
  },
  {
    href: '/staff',
    label: 'Nhân viên',
    icon: UsersRound,
    description: 'Nhân viên, mã PIN và phân quyền',
    permission: 'staff.manage',
  },
  {
    href: '/settings',
    label: 'Cài đặt',
    icon: Settings,
    description: 'Cửa hàng, thiết bị, thanh toán',
    permission: 'settings.manage',
  },
];
