import type { Order, PaymentMethod } from '@/types/order';
import type { SalesReport, TopSellingItem } from '@/types/sales-report';
import { calculateItemsTotal, countItems } from './order-totals';

const TOP_ITEMS_LIMIT = 5;

function createEmptyPaymentTotals(): Record<PaymentMethod, number> {
  return { cash: 0, transfer: 0, card: 0 };
}

export function buildSalesReport(paidOrders: readonly Order[]): SalesReport {
  const revenueByPaymentMethod = createEmptyPaymentTotals();
  const itemTotals = new Map<string, TopSellingItem>();
  let revenue = 0;
  let itemsSold = 0;

  for (const order of paidOrders) {
    const orderTotal = calculateItemsTotal(order.items);
    revenue += orderTotal;
    itemsSold += countItems(order.items);
    if (order.paymentMethod) {
      revenueByPaymentMethod[order.paymentMethod] += orderTotal;
    }

    for (const item of order.items) {
      const current = itemTotals.get(item.menuItemId) ?? {
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += item.quantity;
      current.revenue += item.unitPrice * item.quantity;
      itemTotals.set(item.menuItemId, current);
    }
  }

  const topItems = [...itemTotals.values()]
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, TOP_ITEMS_LIMIT);
  const orderCount = paidOrders.length;
  const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

  return {
    revenue,
    orderCount,
    averageOrderValue,
    itemsSold,
    topItems,
    revenueByPaymentMethod,
  };
}
