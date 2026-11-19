import { calculateItemsTotal } from '@/lib/order-totals';
import type { CashEntry } from '@/types/cash-entry';
import type { EInvoice } from '@/types/einvoice';
import type { Order } from '@/types/order';
import type { ProfitLoss, ProfitLossExpense } from '@/types/profit-loss';
import { findCashCategory } from './find-cash-category';
import { findUninvoicedOrders } from './find-uninvoiced-orders';

interface BuildProfitLossInput {
  orders: readonly Order[];
  invoices: readonly EInvoice[];
  entries: readonly CashEntry[];
}

function sumBy<T>(items: readonly T[], pick: (item: T) => number): number {
  return items.reduce((sum, item) => sum + pick(item), 0);
}

/**
 * Kết quả kinh doanh theo dòng tiền: doanh thu đã gồm thuế trừ thuế GTGT đầu ra trên hóa đơn của
 * chính các đơn đó, cộng thu nhập khác, trừ các khoản chi. Góp vốn, rút vốn, nộp thuế GTGT không
 * tính vào lợi nhuận.
 */
export function buildProfitLoss({
  orders,
  invoices,
  entries,
}: BuildProfitLossInput): ProfitLoss {
  const uninvoicedOrders = findUninvoicedOrders(orders, invoices);
  const orderTotal = (order: Order) => calculateItemsTotal(order.items);

  const expenseTotals = new Map<string, number>();
  let otherIncome = 0;
  for (const entry of entries) {
    if (!findCashCategory(entry.categoryId)?.affectsProfit) {
      continue;
    }
    if (entry.type === 'receipt') {
      otherIncome += entry.amount;
    } else {
      expenseTotals.set(
        entry.categoryId,
        (expenseTotals.get(entry.categoryId) ?? 0) + entry.amount,
      );
    }
  }

  const expenses: ProfitLossExpense[] = [...expenseTotals]
    .map(([categoryId, amount]) => ({
      categoryId,
      label: findCashCategory(categoryId)?.label ?? categoryId,
      amount,
    }))
    .sort((first, second) => second.amount - first.amount);

  const grossRevenue = sumBy(orders, orderTotal);
  const outputVat = sumBy(invoices, (invoice) => invoice.totalVat);
  const netRevenue = grossRevenue - outputVat;
  const totalExpenses = sumBy(expenses, (expense) => expense.amount);

  return {
    grossRevenue,
    outputVat,
    netRevenue,
    otherIncome,
    expenses,
    totalExpenses,
    profit: netRevenue + otherIncome - totalExpenses,
    orderCount: orders.length,
    uninvoicedOrderCount: uninvoicedOrders.length,
    uninvoicedRevenue: sumBy(uninvoicedOrders, orderTotal),
  };
}
