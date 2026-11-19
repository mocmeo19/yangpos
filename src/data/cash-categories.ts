import type { CashCategory } from '@/types/cash-entry';

export const CASH_CATEGORIES: readonly CashCategory[] = [
  {
    id: 'ingredients',
    label: 'Nguyên vật liệu',
    type: 'payment',
    affectsProfit: true,
  },
  {
    id: 'salary',
    label: 'Lương nhân viên',
    type: 'payment',
    affectsProfit: true,
  },
  { id: 'rent', label: 'Thuê mặt bằng', type: 'payment', affectsProfit: true },
  {
    id: 'utilities',
    label: 'Điện, nước, internet',
    type: 'payment',
    affectsProfit: true,
  },
  {
    id: 'equipment',
    label: 'Công cụ, dụng cụ',
    type: 'payment',
    affectsProfit: true,
  },
  {
    id: 'marketing',
    label: 'Quảng cáo, khuyến mãi',
    type: 'payment',
    affectsProfit: true,
  },
  { id: 'fees', label: 'Phí, lệ phí', type: 'payment', affectsProfit: true },
  {
    id: 'vat-payment',
    label: 'Nộp thuế GTGT',
    type: 'payment',
    affectsProfit: false,
  },
  {
    id: 'owner-withdrawal',
    label: 'Rút vốn',
    type: 'payment',
    affectsProfit: false,
  },
  {
    id: 'other-expense',
    label: 'Chi khác',
    type: 'payment',
    affectsProfit: true,
  },
  // Nộp tiền mặt vào ngân hàng hoặc rút về quỹ: lập một phiếu chi ở quỹ này và một phiếu thu ở quỹ kia.
  {
    id: 'transfer-out',
    label: 'Chuyển sang quỹ khác',
    type: 'payment',
    affectsProfit: false,
  },
  { id: 'capital', label: 'Góp vốn', type: 'receipt', affectsProfit: false },
  {
    id: 'transfer-in',
    label: 'Nhận từ quỹ khác',
    type: 'receipt',
    affectsProfit: false,
  },
  {
    id: 'other-income',
    label: 'Thu khác',
    type: 'receipt',
    affectsProfit: true,
  },
];
