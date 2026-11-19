import type { TimeRange } from '@/lib/day-range';
import { calculateItemsTotal } from '@/lib/order-totals';
import type { CashBook, CashBookRow } from '@/types/cash-book';
import type { CashEntry, CashFund } from '@/types/cash-entry';
import type { Order, PaymentMethod } from '@/types/order';
import { findCashCategory } from './find-cash-category';

type UnbalancedRow = Omit<CashBookRow, 'balance'>;

interface DailySales {
  total: number;
  count: number;
  lastPaidAt: number;
}

interface BuildCashBookInput {
  fund: CashFund;
  range: TimeRange;
  /** Mọi đơn đã thanh toán trước thời điểm cuối kỳ. */
  orders: readonly Order[];
  /** Mọi phiếu thu/chi trước thời điểm cuối kỳ. */
  entries: readonly CashEntry[];
}

/** Tiền mặt vào quỹ tiền mặt; chuyển khoản và thẻ đều về tài khoản ngân hàng. */
function toFund(method: PaymentMethod | null): CashFund {
  return method === 'cash' ? 'cash' : 'bank';
}

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

function describeEntry(entry: CashEntry): string {
  const category = findCashCategory(entry.categoryId)?.label ?? '';
  return [category, entry.note, entry.counterparty].filter(Boolean).join(' · ');
}

/** Tiền bán hàng gộp một dòng mỗi ngày như sổ quỹ viết tay; phiếu thu, phiếu chi giữ từng dòng. */
export function buildCashBook({
  fund,
  range,
  orders,
  entries,
}: BuildCashBookInput): CashBook {
  let openingBalance = 0;
  const salesByDay = new Map<number, DailySales>();
  for (const order of orders) {
    if (order.paidAt === null || toFund(order.paymentMethod) !== fund) {
      continue;
    }
    const total = calculateItemsTotal(order.items);
    if (order.paidAt < range.start) {
      openingBalance += total;
      continue;
    }
    if (order.paidAt >= range.end) {
      continue;
    }
    const day = startOfDay(order.paidAt);
    const sales = salesByDay.get(day) ?? { total: 0, count: 0, lastPaidAt: 0 };
    salesByDay.set(day, {
      total: sales.total + total,
      count: sales.count + 1,
      lastPaidAt: Math.max(sales.lastPaidAt, order.paidAt),
    });
  }

  const entryRows: UnbalancedRow[] = [];
  // Phiếu cùng thời điểm (giờ chọn trên form chỉ đến phút) xếp theo thứ tự lập để số dư chạy đúng.
  const orderedEntries = [...entries].sort(
    (first, second) =>
      first.occurredAt - second.occurredAt ||
      first.createdAt - second.createdAt,
  );
  for (const entry of orderedEntries) {
    if (entry.fund !== fund) {
      continue;
    }
    const isReceipt = entry.type === 'receipt';
    if (entry.occurredAt < range.start) {
      openingBalance += isReceipt ? entry.amount : -entry.amount;
      continue;
    }
    if (entry.occurredAt >= range.end) {
      continue;
    }
    entryRows.push({
      id: entry.id,
      occurredAt: entry.occurredAt,
      reference: entry.number,
      description: describeEntry(entry),
      receipt: isReceipt ? entry.amount : 0,
      payment: isReceipt ? 0 : entry.amount,
      entryId: entry.id,
    });
  }

  const salesRows: UnbalancedRow[] = [...salesByDay].map(([day, sales]) => ({
    id: `sales-${day}`,
    occurredAt: sales.lastPaidAt,
    reference: 'Bán hàng',
    description: `Thu tiền bán hàng (${sales.count} đơn)`,
    receipt: sales.total,
    payment: 0,
    entryId: null,
  }));

  let balance = openingBalance;
  const rows = [...salesRows, ...entryRows]
    .sort((first, second) => first.occurredAt - second.occurredAt)
    .map((row) => {
      balance += row.receipt - row.payment;
      return { ...row, balance };
    });

  return {
    openingBalance,
    rows,
    totalReceipts: rows.reduce((sum, row) => sum + row.receipt, 0),
    totalPayments: rows.reduce((sum, row) => sum + row.payment, 0),
    closingBalance: balance,
  };
}
