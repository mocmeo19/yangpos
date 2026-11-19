import {
  CreditCard,
  Landmark,
  Printer,
  ReceiptText,
  ScanBarcode,
  Store,
  Vault,
  Vibrate,
} from 'lucide-react';
import type { SettingsSection } from '@/types/settings';
import type { SettingsSectionMeta } from '@/types/settings-section-meta';
import { SETTINGS_SECTION_GROUPS } from './settings-section-groups';

export const SETTINGS_SECTION_META: Record<
  SettingsSection,
  SettingsSectionMeta
> = {
  store: {
    section: 'store',
    slug: 'store',
    title: 'Cửa hàng',
    description: 'Tên, địa chỉ và lời nhắn in trên hóa đơn.',
    icon: Store,
  },
  eInvoice: {
    section: 'eInvoice',
    slug: 'einvoice',
    title: 'Hóa đơn điện tử',
    description:
      'Hóa đơn khởi tạo từ máy tính tiền theo Nghị định 70/2025/NĐ-CP.',
    icon: ReceiptText,
  },
  printer: {
    section: 'printer',
    slug: 'printer',
    title: 'Máy in hóa đơn',
    description: 'Chọn cách in, khổ giấy và in thử.',
    icon: Printer,
  },
  cashDrawer: {
    section: 'cashDrawer',
    slug: 'cash-drawer',
    title: 'Két tiền',
    description: 'Tự mở két khi thu tiền mặt.',
    icon: Vault,
  },
  pager: {
    section: 'pager',
    slug: 'pager',
    title: 'Thẻ rung',
    description: 'Bộ thẻ rung gọi khách tự phục vụ tới quầy lấy món.',
    icon: Vibrate,
  },
  bankTransfer: {
    section: 'bankTransfer',
    slug: 'bank-transfer',
    title: 'Chuyển khoản',
    description: 'Tài khoản nhận tiền và mã VietQR.',
    icon: Landmark,
  },
  cardPayment: {
    section: 'cardPayment',
    slug: 'card-payment',
    title: 'Thanh toán thẻ',
    description: 'Máy POS Visa, Mastercard và loại thẻ chấp nhận.',
    icon: CreditCard,
  },
  scanner: {
    section: 'scanner',
    slug: 'scanner',
    title: 'Máy quét mã',
    description: 'Quét mã vạch để thêm món nhanh.',
    icon: ScanBarcode,
  },
};

export const SETTINGS_SECTION_ORDER: readonly SettingsSection[] =
  SETTINGS_SECTION_GROUPS.flatMap((group) => group.sections);
