import { DEFAULT_MENU_UNIT } from '@/data/menu-units';
import { formatAmountInWords } from '@/lib/finance/amount-in-words';
import type {
  EInvoiceContent,
  InvoiceBuyer,
  PricedInvoiceLine,
} from '@/types/einvoice';
import type { MenuItem } from '@/types/menu';
import type { Order } from '@/types/order';
import type { EInvoiceSettings } from '@/types/settings';
import { calculateInvoiceAmounts } from './calculate-invoice-amounts';

interface BuildEInvoiceContentInput {
  order: Order;
  buyer: InvoiceBuyer | null;
  settings: EInvoiceSettings;
  /** Món hiện tại trên thực đơn, để lấy đơn vị tính và thuế suất riêng của từng món. */
  menuItems: ReadonlyMap<string, MenuItem>;
  isSandbox: boolean;
}

/** Cùng một món gọi nhiều lần với ghi chú khác nhau được gộp thành một dòng trên hóa đơn. */
function toPricedLines(
  order: Order,
  menuItems: ReadonlyMap<string, MenuItem>,
  settings: EInvoiceSettings,
): PricedInvoiceLine[] {
  const linesByKey = new Map<string, PricedInvoiceLine>();
  for (const item of order.items) {
    const key = `${item.menuItemId}:${item.unitPrice}`;
    const existing = linesByKey.get(key);
    if (existing) {
      linesByKey.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
      continue;
    }
    const menuItem = menuItems.get(item.menuItemId);
    linesByKey.set(key, {
      name: item.name,
      unit: menuItem?.unit || DEFAULT_MENU_UNIT,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      vatRate: menuItem?.vatRate ?? settings.defaultVatRate,
    });
  }
  return [...linesByKey.values()];
}

export function buildEInvoiceContent({
  order,
  buyer,
  settings,
  menuItems,
  isSandbox,
}: BuildEInvoiceContentInput): EInvoiceContent {
  if (!order.paymentMethod) {
    throw new Error('Chỉ lập hóa đơn cho đơn đã thanh toán.');
  }
  const amounts = calculateInvoiceAmounts(
    toPricedLines(order, menuItems, settings),
    settings.template,
  );
  return {
    ...amounts,
    orderId: order.id,
    orderNumber: order.number,
    template: settings.template,
    seller: {
      name: settings.sellerName,
      taxCode: settings.sellerTaxCode,
      address: settings.sellerAddress,
      phone: settings.sellerPhone,
    },
    buyer,
    paymentMethod: order.paymentMethod,
    totalInWords: formatAmountInWords(amounts.totalAmount),
    isSandbox,
  };
}
