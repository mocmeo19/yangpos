import 'server-only';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { findCashCategory } from '@/lib/finance/find-cash-category';
import { getCollections, WITHOUT_MONGO_ID } from '@/server/db/collections';
import type { TimeRange } from '@/lib/day-range';
import type { CashBookSource } from '@/types/cash-book';
import type {
  CashEntry,
  CashEntryInput,
  CashEntryType,
} from '@/types/cash-entry';
import type { Order } from '@/types/order';
import { nextCounterValue } from './next-counter-value';

const NUMBER_PREFIXES: Record<CashEntryType, string> = {
  receipt: 'PT',
  payment: 'PC',
};
const NUMBER_DIGITS = 6;
// Cho phép lệch đồng hồ một chút giữa lúc chọn giờ và lúc bấm lưu.
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;

function validateCashEntry(input: CashEntryInput): CashEntryInput {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new UserFacingError('Số tiền phải lớn hơn 0.');
  }
  if (findCashCategory(input.categoryId)?.type !== input.type) {
    throw new UserFacingError('Chọn khoản mục phù hợp với loại phiếu.');
  }
  if (!Number.isFinite(input.occurredAt)) {
    throw new UserFacingError('Thời gian lập phiếu chưa đúng.');
  }
  if (input.occurredAt > Date.now() + FUTURE_TOLERANCE_MS) {
    throw new UserFacingError('Không lập phiếu cho thời điểm trong tương lai.');
  }
  return {
    ...input,
    counterparty: input.counterparty.trim(),
    note: input.note.trim(),
  };
}

export async function listCashEntriesInRange({
  start,
  end,
}: TimeRange): Promise<CashEntry[]> {
  const { cashEntries } = await getCollections();
  return cashEntries
    .find<CashEntry>(
      { occurredAt: { $gte: start, $lt: end } },
      WITHOUT_MONGO_ID,
    )
    .toArray();
}

/** Mọi đơn đã thu tiền và mọi phiếu trước cuối kỳ, vì tồn đầu kỳ cộng dồn từ ngày đầu tiên. */
export async function getCashBookSource(end: number): Promise<CashBookSource> {
  const { orders, cashEntries } = await getCollections();
  const [paidOrders, entries] = await Promise.all([
    orders.find<Order>({ paidAt: { $lt: end } }, WITHOUT_MONGO_ID).toArray(),
    cashEntries
      .find<CashEntry>({ occurredAt: { $lt: end } }, WITHOUT_MONGO_ID)
      .toArray(),
  ]);
  return { orders: paidOrders, entries };
}

/** Số phiếu tăng dần riêng cho phiếu thu (PT) và phiếu chi (PC), vd "PC000012". */
export async function addCashEntry(input: CashEntryInput): Promise<CashEntry> {
  const validInput = validateCashEntry(input);
  const collections = await getCollections();
  const sequence = await nextCounterValue(
    collections,
    `cash-entry:${validInput.type}`,
  );
  const entry: CashEntry = {
    ...validInput,
    id: createId(),
    number: `${NUMBER_PREFIXES[validInput.type]}${String(sequence).padStart(NUMBER_DIGITS, '0')}`,
    createdAt: Date.now(),
  };
  await collections.cashEntries.insertOne({ ...entry });
  return entry;
}

export async function deleteCashEntry(id: string): Promise<void> {
  const { cashEntries } = await getCollections();
  await cashEntries.deleteOne({ id });
}
