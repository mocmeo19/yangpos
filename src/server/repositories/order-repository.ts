import 'server-only';
import type { UpdateFilter } from 'mongodb';
import { setTimeout as delay } from 'node:timers/promises';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { formatOrderNumber } from '@/lib/format-order-number';
import { isOrderPaid } from '@/lib/is-order-paid';
import { mergeOrderItems } from '@/lib/merge-order-items';
import {
  ACTIVE_ORDER_STATUSES,
  getNextKitchenStatus,
  isActiveOrderStatus,
} from '@/lib/order-status';
import { getCollections, WITHOUT_MONGO_ID } from '@/server/db/collections';
import { isDuplicateKeyError } from '@/server/db/duplicate-key';
import {
  ACTIVE_ORDER_PER_PAGER_INDEX,
  ACTIVE_ORDER_PER_TABLE_INDEX,
} from '@/server/db/ensure-database';
import type { TimeRange } from '@/lib/day-range';
import type {
  Order,
  OrderStatus,
  PaymentInput,
  PlaceOrderInput,
} from '@/types/order';
import { nextCounterValue } from './next-counter-value';

const ORDER_NUMBER_COUNTER = 'order-number';
const ACTIVE_STATUS_FILTER = { $in: [...ACTIVE_ORDER_STATUSES] };
// Nhiều máy cùng gọi món cho một bàn thì máy chậm hơn đọc lại đơn và gộp món. Chờ một khoảng ngẫu
// nhiên giữa các lần thử để các máy không tiếp tục đụng nhau đúng cùng một thời điểm.
const MAX_PLACE_ORDER_ATTEMPTS = 6;
const RETRY_BASE_DELAY_MS = 15;
const RETRY_JITTER_MS = 35;

const CHANGED_ELSEWHERE_MESSAGE =
  'Đơn vừa được thay đổi ở máy khác, vui lòng xem lại rồi thử lại.';

export type ClosedOrderStatus = Extract<OrderStatus, 'paid' | 'cancelled'>;

export async function listActiveOrders(): Promise<Order[]> {
  const { orders } = await getCollections();
  return orders
    .find<Order>(
      { status: ACTIVE_STATUS_FILTER },
      { ...WITHOUT_MONGO_ID, sort: { createdAt: 1 } },
    )
    .toArray();
}

export async function listClosedOrders(
  status: ClosedOrderStatus,
  limit: number,
): Promise<Order[]> {
  const { orders } = await getCollections();
  return orders
    .find<Order>(
      { status },
      { ...WITHOUT_MONGO_ID, sort: { updatedAt: -1 }, limit },
    )
    .toArray();
}

export async function listPaidOrdersInRange({
  start,
  end,
}: TimeRange): Promise<Order[]> {
  const { orders } = await getCollections();
  return orders
    .find<Order>({ paidAt: { $gte: start, $lt: end } }, WITHOUT_MONGO_ID)
    .toArray();
}

export async function findOrder(id: string): Promise<Order | null> {
  const { orders } = await getCollections();
  return orders.findOne<Order>({ id }, WITHOUT_MONGO_ID);
}

async function getOrderOrThrow(id: string): Promise<Order> {
  const order = await findOrder(id);
  if (!order) {
    throw new UserFacingError('Không tìm thấy đơn hàng.', 404);
  }
  return order;
}

function assertActive(order: Order): void {
  if (!isActiveOrderStatus(order.status)) {
    throw new UserFacingError('Đơn hàng đã đóng, không thể thay đổi.');
  }
}

/**
 * Chỉ ghi khi đơn còn đúng như lúc đọc (cùng trạng thái, cùng lần cập nhật, cùng tình trạng thu
 * tiền). Thay cho transaction: máy thứ hai thao tác trên đơn cũ sẽ bị từ chối thay vì ghi đè.
 */
async function updateIfUnchanged(
  current: Order,
  update: UpdateFilter<Order>,
): Promise<void> {
  const { orders } = await getCollections();
  const result = await orders.updateOne(
    {
      id: current.id,
      status: current.status,
      updatedAt: current.updatedAt,
      paidAt: current.paidAt,
    },
    update,
  );
  if (result.matchedCount === 0) {
    throw new UserFacingError(CHANGED_ELSEWHERE_MESSAGE, 409);
  }
}

function pagerTakenMessage(pagerNumber: number, owner: Order | null): string {
  if (!owner) {
    return `Thẻ số ${pagerNumber} vừa được gắn cho đơn khác.`;
  }
  return `Thẻ số ${pagerNumber} đang dùng cho đơn ${formatOrderNumber(owner.number)}.`;
}

/** Kiểm tra trước để có thông báo rõ ràng; chỉ mục duy nhất vẫn chặn khi hai máy gắn cùng lúc. */
async function assertPagerAvailable(
  pagerNumber: number,
  currentOrderId?: string,
): Promise<void> {
  if (!Number.isInteger(pagerNumber) || pagerNumber < 1) {
    throw new UserFacingError('Số thẻ rung phải là số nguyên dương.');
  }
  const { orders } = await getCollections();
  const owner = await orders.findOne<Order>(
    {
      status: ACTIVE_STATUS_FILTER,
      pagerNumber,
      ...(currentOrderId ? { id: { $ne: currentOrderId } } : {}),
    },
    WITHOUT_MONGO_ID,
  );
  if (owner) {
    throw new UserFacingError(pagerTakenMessage(pagerNumber, owner));
  }
}

async function findActiveOrderForTable(tableId: string): Promise<Order | null> {
  const { orders } = await getCollections();
  return orders.findOne<Order>(
    { tableId, status: ACTIVE_STATUS_FILTER },
    WITHOUT_MONGO_ID,
  );
}

/** Gộp món mới vào đơn đang mở của bàn; `null` khi đơn vừa bị máy khác đổi và cần đọc lại. */
async function addItemsToOpenOrder(
  openOrder: Order,
  items: PlaceOrderInput['items'],
): Promise<Order | null> {
  const updatedOrder: Order = {
    ...openOrder,
    items: mergeOrderItems(openOrder.items, items),
    status: 'pending',
    updatedAt: Date.now(),
  };
  try {
    await updateIfUnchanged(openOrder, {
      $set: {
        items: updatedOrder.items,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      },
    });
    return updatedOrder;
  } catch (error) {
    if (error instanceof UserFacingError && error.status === 409) {
      return null;
    }
    throw error;
  }
}

/** Tạo đơn mới; `null` khi máy khác vừa mở đơn cho cùng bàn và cần gộp vào đơn đó. */
async function insertNewOrder({
  tableId,
  items,
  pagerNumber,
}: PlaceOrderInput): Promise<Order | null> {
  const usesPager = !tableId && pagerNumber !== null;
  if (usesPager) {
    await assertPagerAvailable(pagerNumber);
  }
  const collections = await getCollections();
  const now = Date.now();
  const newOrder: Order = {
    id: createId(),
    number: await nextCounterValue(collections, ORDER_NUMBER_COUNTER),
    tableId,
    status: 'pending',
    items: items.map((item) => ({ ...item })),
    createdAt: now,
    updatedAt: now,
    paidAt: null,
    paymentMethod: null,
    ...(usesPager ? { pagerNumber } : {}),
  };
  try {
    await collections.orders.insertOne({ ...newOrder });
    return newOrder;
  } catch (error) {
    if (isDuplicateKeyError(error, ACTIVE_ORDER_PER_TABLE_INDEX)) {
      return null;
    }
    if (usesPager && isDuplicateKeyError(error, ACTIVE_ORDER_PER_PAGER_INDEX)) {
      throw new UserFacingError(pagerTakenMessage(pagerNumber, null));
    }
    throw error;
  }
}

/**
 * Bàn đang có đơn mở thì món mới được gộp vào đơn đó và đơn quay về trạng thái chờ chế biến để
 * bếp thấy món vừa gọi thêm. Đơn mang đi luôn tạo đơn mới và có thể kèm thẻ rung.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  if (input.items.length === 0) {
    throw new UserFacingError('Đơn hàng chưa có món nào.');
  }
  const { diningTables } = await getCollections();
  if (
    input.tableId &&
    !(await diningTables.countDocuments({ id: input.tableId }))
  ) {
    throw new UserFacingError('Bàn đã chọn không còn tồn tại.');
  }

  for (let attempt = 0; attempt < MAX_PLACE_ORDER_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await delay(RETRY_BASE_DELAY_MS + Math.random() * RETRY_JITTER_MS);
    }
    const openOrder = input.tableId
      ? await findActiveOrderForTable(input.tableId)
      : null;
    const order = openOrder
      ? await addItemsToOpenOrder(openOrder, input.items)
      : await insertNewOrder(input);
    if (order) {
      return order;
    }
  }
  throw new UserFacingError(
    'Bàn đang được gọi món ở máy khác, vui lòng thử lại.',
    409,
  );
}

export async function advanceKitchenStatus(id: string): Promise<void> {
  const order = await getOrderOrThrow(id);
  const nextStatus = getNextKitchenStatus(order.status);
  if (!nextStatus) {
    throw new UserFacingError('Đơn hàng không thể chuyển sang bước tiếp theo.');
  }
  await updateIfUnchanged(order, {
    $set: { status: nextStatus, updatedAt: Date.now() },
  });
}

/**
 * Trả về đơn sau khi thanh toán để in hóa đơn ngay. Đơn có thẻ rung trả tiền trước vẫn ở màn bếp
 * tới khi khách nhận món; các đơn khác đóng ngay. Điều kiện `paidAt` khi ghi đảm bảo một đơn không
 * bao giờ bị thu tiền hai lần dù hai máy bấm cùng lúc.
 */
export async function payOrder(
  id: string,
  payment: PaymentInput,
): Promise<Order> {
  const order = await getOrderOrThrow(id);
  assertActive(order);
  if (isOrderPaid(order)) {
    throw new UserFacingError(
      `Đơn ${formatOrderNumber(order.number)} đã thanh toán.`,
    );
  }
  const now = Date.now();
  const staysInKitchen =
    order.pagerNumber !== undefined && order.status !== 'served';
  const paidOrder: Order = {
    ...order,
    status: staysInKitchen ? order.status : 'paid',
    paymentMethod: payment.method,
    paymentDetails: payment.details,
    paidAt: now,
    updatedAt: now,
  };
  await updateIfUnchanged(order, {
    $set: {
      status: paidOrder.status,
      paymentMethod: payment.method,
      paymentDetails: payment.details,
      paidAt: now,
      updatedAt: now,
    },
  });
  return paidOrder;
}

/** Khách cầm thẻ rung tới quầy nhận món: đóng đơn đã thu tiền và trả thẻ về để dùng tiếp. */
export async function completePickup(id: string): Promise<void> {
  const order = await getOrderOrThrow(id);
  assertActive(order);
  if (!isOrderPaid(order)) {
    throw new UserFacingError(
      `Đơn ${formatOrderNumber(order.number)} chưa thanh toán, hãy thu tiền trước.`,
    );
  }
  await updateIfUnchanged(order, {
    $set: { status: 'paid', updatedAt: Date.now() },
  });
}

/** `null` để gỡ thẻ khỏi đơn, vd khi khách không cần chờ thẻ rung nữa. */
export async function assignPager(
  id: string,
  pagerNumber: number | null,
): Promise<void> {
  const order = await getOrderOrThrow(id);
  assertActive(order);
  if (order.tableId) {
    throw new UserFacingError(
      'Đơn tại bàn được mang món tận bàn, không dùng thẻ rung.',
    );
  }
  const updatedAt = Date.now();
  if (pagerNumber === null) {
    await updateIfUnchanged(order, {
      $set: { updatedAt },
      $unset: { pagerNumber: '', pagerCalledAt: '' },
    });
    return;
  }
  await assertPagerAvailable(pagerNumber, id);
  try {
    await updateIfUnchanged(order, {
      $set: { pagerNumber, updatedAt },
      $unset: { pagerCalledAt: '' },
    });
  } catch (error) {
    if (isDuplicateKeyError(error, ACTIVE_ORDER_PER_PAGER_INDEX)) {
      throw new UserFacingError(pagerTakenMessage(pagerNumber, null));
    }
    throw error;
  }
}

export async function markPagerCalled(id: string): Promise<void> {
  const { orders } = await getCollections();
  await orders.updateOne({ id }, { $set: { pagerCalledAt: Date.now() } });
}

export async function cancelOrder(id: string): Promise<void> {
  const order = await getOrderOrThrow(id);
  assertActive(order);
  if (isOrderPaid(order)) {
    throw new UserFacingError('Đơn đã thu tiền, không thể hủy.');
  }
  await updateIfUnchanged(order, {
    $set: { status: 'cancelled', updatedAt: Date.now() },
  });
}
