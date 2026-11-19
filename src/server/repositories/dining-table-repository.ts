import 'server-only';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { ACTIVE_ORDER_STATUSES } from '@/lib/order-status';
import { getCollections, WITHOUT_MONGO_ID } from '@/server/db/collections';
import type { DiningTable, DiningTableInput } from '@/types/dining-table';

function validateTable(input: DiningTableInput): DiningTableInput {
  const name = input.name.trim();
  if (!name) {
    throw new UserFacingError('Tên bàn không được để trống.');
  }
  if (!Number.isInteger(input.seats) || input.seats < 1) {
    throw new UserFacingError('Số ghế phải là số nguyên lớn hơn 0.');
  }
  return { name, seats: input.seats };
}

export async function listDiningTables(): Promise<DiningTable[]> {
  const { diningTables } = await getCollections();
  return diningTables
    .find<DiningTable>({}, { ...WITHOUT_MONGO_ID, sort: { sortOrder: 1 } })
    .toArray();
}

export async function addDiningTable(
  input: DiningTableInput,
): Promise<DiningTable> {
  const validInput = validateTable(input);
  const collections = await getCollections();
  const last = await collections.diningTables.findOne<DiningTable>(
    {},
    { ...WITHOUT_MONGO_ID, sort: { sortOrder: -1 } },
  );
  const table: DiningTable = {
    ...validInput,
    id: createId(),
    sortOrder: (last?.sortOrder ?? -1) + 1,
  };
  await collections.diningTables.insertOne({ ...table });
  return table;
}

export async function updateDiningTable(
  id: string,
  input: DiningTableInput,
): Promise<void> {
  const { diningTables } = await getCollections();
  await diningTables.updateOne({ id }, { $set: validateTable(input) });
}

export async function deleteDiningTable(id: string): Promise<void> {
  const collections = await getCollections();
  const activeOrderCount = await collections.orders.countDocuments({
    tableId: id,
    status: { $in: [...ACTIVE_ORDER_STATUSES] },
  });
  if (activeOrderCount > 0) {
    throw new UserFacingError(
      'Bàn đang có đơn chưa thanh toán, không thể xóa.',
    );
  }
  await collections.diningTables.deleteOne({ id });
}
