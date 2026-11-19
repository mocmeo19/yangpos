import 'server-only';
import { ACTIVE_ORDER_STATUSES } from '@/lib/order-status';
import type { PosCollections } from './collections';
import { isDuplicateKeyError } from './duplicate-key';
import { seedDatabase } from './seed-database';

const SEED_MARKER_ID = 'seed:v1';

/**
 * Không dùng transaction (MongoDB chạy độc lập), nên các ràng buộc giữa nhiều máy được giữ bằng
 * chỉ mục duy nhất: mỗi bàn chỉ một đơn đang mở, mỗi thẻ rung chỉ ở một đơn đang mở.
 */
export const ACTIVE_ORDER_PER_TABLE_INDEX = 'active_order_per_table';
export const ACTIVE_ORDER_PER_PAGER_INDEX = 'active_order_per_pager';

const ACTIVE_STATUS_FILTER = { $in: [...ACTIVE_ORDER_STATUSES] };

async function createIndexes(c: PosCollections): Promise<void> {
  const unique = { unique: true };
  await Promise.all([
    c.categories.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { sortOrder: 1 } },
    ]),
    c.menuItems.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { categoryId: 1 } },
      { key: { createdAt: 1 } },
      // Mã vạch là duy nhất nhưng món không có mã thì không bị đánh chỉ mục.
      {
        key: { barcode: 1 },
        unique: true,
        partialFilterExpression: { barcode: { $type: 'string' } },
      },
    ]),
    c.diningTables.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { sortOrder: 1 } },
    ]),
    c.orders.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { number: 1 }, ...unique },
      { key: { status: 1, updatedAt: -1 } },
      { key: { tableId: 1 } },
      { key: { createdAt: 1 } },
      { key: { paidAt: 1 } },
      {
        key: { tableId: 1 },
        name: ACTIVE_ORDER_PER_TABLE_INDEX,
        unique: true,
        partialFilterExpression: {
          status: ACTIVE_STATUS_FILTER,
          tableId: { $type: 'string' },
        },
      },
      {
        key: { pagerNumber: 1 },
        name: ACTIVE_ORDER_PER_PAGER_INDEX,
        unique: true,
        partialFilterExpression: {
          status: ACTIVE_STATUS_FILTER,
          pagerNumber: { $type: 'number' },
        },
      },
    ]),
    c.settings.createIndexes([{ key: { id: 1 }, ...unique }]),
    c.einvoices.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { orderId: 1 }, ...unique },
      { key: { issuedAt: 1 } },
    ]),
    c.cashEntries.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { occurredAt: 1 } },
    ]),
    c.counters.createIndexes([{ key: { id: 1 }, ...unique }]),
    c.staffRoles.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { sortOrder: 1 } },
    ]),
    c.employees.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { roleId: 1 } },
      { key: { createdAt: 1 } },
    ]),
    c.reservations.createIndexes([
      { key: { id: 1 }, ...unique },
      { key: { reservedAt: 1 } },
      { key: { tableId: 1, status: 1 } },
    ]),
  ]);
}

/**
 * Ghi dấu trước rồi mới tạo dữ liệu mẫu: nhờ chỉ mục duy nhất của `counters`, dù nhiều request
 * đầu tiên chạy cùng lúc cũng chỉ một request được tạo dữ liệu mẫu.
 */
async function seedOnce(c: PosCollections): Promise<void> {
  try {
    await c.counters.insertOne({ id: SEED_MARKER_ID, value: 1 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return;
    }
    throw error;
  }
  await seedDatabase(c);
}

const globalForSetup = globalThis as typeof globalThis & {
  yangposDatabaseReady?: Promise<void>;
};

/** Chạy một lần cho mỗi tiến trình; thất bại thì lần gọi sau thử lại. */
export function ensureDatabaseReady(c: PosCollections): Promise<void> {
  globalForSetup.yangposDatabaseReady ??= (async () => {
    await createIndexes(c);
    await seedOnce(c);
  })().catch((error: unknown) => {
    globalForSetup.yangposDatabaseReady = undefined;
    throw error;
  });
  return globalForSetup.yangposDatabaseReady;
}
