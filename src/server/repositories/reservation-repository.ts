import 'server-only';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { formatTime } from '@/lib/format-time';
import { RESERVATION_HOLD_MS } from '@/lib/reservation/reservation-rules';
import {
  getCollections,
  WITHOUT_MONGO_ID,
  type PosCollections,
} from '@/server/db/collections';
import type { TimeRange } from '@/lib/day-range';
import type { DiningTable } from '@/types/dining-table';
import type {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from '@/types/reservation';

const MAX_PARTY_SIZE = 200;

function validateReservation(input: ReservationInput): ReservationInput {
  const customerName = input.customerName.trim();
  if (!customerName) {
    throw new UserFacingError('Vui lòng nhập tên khách.');
  }
  const phone = input.phone.replace(/[^\d+]/g, '');
  if (
    !Number.isInteger(input.partySize) ||
    input.partySize < 1 ||
    input.partySize > MAX_PARTY_SIZE
  ) {
    throw new UserFacingError(`Số khách phải từ 1 đến ${MAX_PARTY_SIZE}.`);
  }
  if (!Number.isFinite(input.reservedAt)) {
    throw new UserFacingError('Vui lòng chọn giờ khách đến.');
  }
  return { ...input, customerName, phone, note: input.note.trim() };
}

export async function listReservationsInRange({
  start,
  end,
}: TimeRange): Promise<Reservation[]> {
  const { reservations } = await getCollections();
  return reservations
    .find<Reservation>(
      { reservedAt: { $gte: start, $lt: end } },
      { ...WITHOUT_MONGO_ID, sort: { reservedAt: 1 } },
    )
    .toArray();
}

async function getReservationOrThrow(
  collections: PosCollections,
  id: string,
): Promise<Reservation> {
  const reservation = await collections.reservations.findOne<Reservation>(
    { id },
    WITHOUT_MONGO_ID,
  );
  if (!reservation) {
    throw new UserFacingError('Không tìm thấy lượt đặt bàn.', 404);
  }
  return reservation;
}

/**
 * Một bàn không nhận hai lượt đặt cách nhau dưới thời gian giữ bàn. Không có transaction nên hai
 * máy đặt đúng cùng một bàn trong cùng tích tắc vẫn có thể lọt; nhân viên sẽ thấy cả hai trong lịch.
 */
async function assertTableFree(
  collections: PosCollections,
  input: ReservationInput,
  excludedId?: string,
): Promise<void> {
  if (!input.tableId) {
    return;
  }
  const table = await collections.diningTables.findOne<DiningTable>(
    { id: input.tableId },
    WITHOUT_MONGO_ID,
  );
  if (!table) {
    throw new UserFacingError(
      'Bàn đã chọn không còn tồn tại, vui lòng chọn lại.',
    );
  }
  const conflict = await collections.reservations.findOne<Reservation>(
    {
      tableId: input.tableId,
      status: 'booked',
      reservedAt: {
        $gt: input.reservedAt - RESERVATION_HOLD_MS,
        $lt: input.reservedAt + RESERVATION_HOLD_MS,
      },
      ...(excludedId ? { id: { $ne: excludedId } } : {}),
    },
    WITHOUT_MONGO_ID,
  );
  if (conflict) {
    throw new UserFacingError(
      `${table.name} đã có khách ${conflict.customerName} đặt lúc ${formatTime(conflict.reservedAt)}.`,
    );
  }
}

export async function addReservation(
  input: ReservationInput,
): Promise<Reservation> {
  const validInput = validateReservation(input);
  const collections = await getCollections();
  await assertTableFree(collections, validInput);
  const reservation: Reservation = {
    ...validInput,
    id: createId(),
    status: 'booked',
    createdAt: Date.now(),
  };
  await collections.reservations.insertOne({ ...reservation });
  return reservation;
}

export async function updateReservation(
  id: string,
  input: ReservationInput,
): Promise<void> {
  const validInput = validateReservation(input);
  const collections = await getCollections();
  const current = await getReservationOrThrow(collections, id);
  if (current.status === 'booked') {
    await assertTableFree(collections, validInput, id);
  }
  await collections.reservations.updateOne({ id }, { $set: validInput });
}

/** Đổi trạng thái lượt đặt; đặt lại về "Đã đặt" vẫn phải kiểm tra trùng bàn. */
export async function setReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
  const collections = await getCollections();
  const current = await getReservationOrThrow(collections, id);
  if (status === 'booked') {
    await assertTableFree(collections, current, id);
  }
  await collections.reservations.updateOne({ id }, { $set: { status } });
  return { ...current, status };
}
