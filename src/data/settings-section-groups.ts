import type { SettingsSectionGroup } from '@/types/settings-section-group';

/** Nhóm các mục trên trang Cài đặt; thứ tự ở đây cũng là thứ tự trên menu bên trái. */
export const SETTINGS_SECTION_GROUPS: readonly SettingsSectionGroup[] = [
  { title: 'Cửa hàng và hóa đơn', sections: ['store', 'eInvoice'] },
  { title: 'Thanh toán', sections: ['bankTransfer', 'cardPayment'] },
  {
    title: 'Thiết bị',
    sections: ['printer', 'cashDrawer', 'pager', 'scanner'],
  },
];
