import 'server-only';
import { createId } from '@/lib/create-id';
import { buildCashRegisterCode } from '@/lib/einvoice/build-cash-register-code';
import { buildEInvoiceContent } from '@/lib/einvoice/build-einvoice-content';
import { buildEInvoiceSeries } from '@/lib/einvoice/build-einvoice-series';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { getEInvoiceProvider } from '@/lib/einvoice/providers/get-einvoice-provider';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { formatOrderNumber } from '@/lib/format-order-number';
import { isOrderPaid } from '@/lib/is-order-paid';
import { mergeWithDefaultSettings } from '@/lib/merge-settings';
import {
  getCollections,
  WITHOUT_MONGO_ID,
  type PosCollections,
} from '@/server/db/collections';
import { isDuplicateKeyError } from '@/server/db/duplicate-key';
import type { TimeRange } from '@/lib/day-range';
import type { EInvoice, InvoiceBuyer } from '@/types/einvoice';
import type { EInvoiceTransmitChanges } from '@/types/einvoice-provider';
import type { MenuItem } from '@/types/menu';
import type { Order } from '@/types/order';
import type { EInvoiceSettings } from '@/types/settings';
import { nextCounterValue } from './next-counter-value';
import { getStoredSettings } from './settings-repository';

type InvoiceNumbering = Pick<EInvoice, 'number' | 'taxAuthorityCode'>;

const NOT_NUMBERED_YET: InvoiceNumbering = {
  number: null,
  taxAuthorityCode: '',
};

export async function listEInvoicesInRange({
  start,
  end,
}: TimeRange): Promise<EInvoice[]> {
  const { einvoices } = await getCollections();
  return einvoices
    .find<EInvoice>({ issuedAt: { $gte: start, $lt: end } }, WITHOUT_MONGO_ID)
    .toArray();
}

export async function listEInvoicesForOrders(
  orderIds: readonly string[],
): Promise<EInvoice[]> {
  const { einvoices } = await getCollections();
  return einvoices
    .find<EInvoice>({ orderId: { $in: [...orderIds] } }, WITHOUT_MONGO_ID)
    .toArray();
}

export async function findEInvoiceForOrder(
  orderId: string,
): Promise<EInvoice | null> {
  const { einvoices } = await getCollections();
  return einvoices.findOne<EInvoice>({ orderId }, WITHOUT_MONGO_ID);
}

async function loadMenuItems(
  collections: PosCollections,
  ids: readonly string[],
): Promise<Map<string, MenuItem>> {
  const items = await collections.menuItems
    .find<MenuItem>({ id: { $in: [...new Set(ids)] } }, WITHOUT_MONGO_ID)
    .toArray();
  return new Map(items.map((item) => [item.id, item]));
}

/** Cấp số và mã của cơ quan thuế ngay trên máy, theo bộ đếm riêng của từng ký hiệu và từng năm. */
async function assignLocalNumbering(
  collections: PosCollections,
  settings: EInvoiceSettings,
  series: string,
  issuedAt: number,
): Promise<InvoiceNumbering> {
  const year = new Date(issuedAt).getFullYear();
  const invoiceNumber = await nextCounterValue(
    collections,
    `einvoice:${settings.template}${series}`,
  );
  const codeSequence = await nextCounterValue(
    collections,
    `einvoice-code:${settings.template}-${year}`,
  );
  return {
    number: invoiceNumber,
    taxAuthorityCode: buildCashRegisterCode({
      template: settings.template,
      issuedAt,
      taxAuthorityPrefix: settings.taxAuthorityPrefix,
      terminalCode: settings.terminalCode,
      sequence: codeSequence,
    }),
  };
}

function describeExistingInvoice(
  orderLabel: string,
  invoice: EInvoice,
): string {
  if (invoice.number === null) {
    return `Đơn ${orderLabel} đã có hóa đơn đang chờ phát hành.`;
  }
  return `Đơn ${orderLabel} đã có hóa đơn số ${formatEInvoiceNumber(invoice.number)}.`;
}

async function assertNoInvoiceYet(order: Order): Promise<void> {
  const existing = await findEInvoiceForOrder(order.id);
  if (existing) {
    throw new UserFacingError(
      describeExistingInvoice(formatOrderNumber(order.number), existing),
    );
  }
}

/**
 * Lập hóa đơn cho đơn đã thanh toán theo cài đặt lưu trên server. Hóa đơn được lưu trước, chưa có
 * số: chỉ mục duy nhất theo đơn hàng chặn hai máy cùng lập cho một đơn. Chỉ khi lưu xong mới lấy
 * số từ bộ đếm, để lần lập bị chặn không làm nhảy số hóa đơn. Nhà cung cấp tự cấp số thì hóa đơn
 * giữ trạng thái chưa có số cho tới khi phát hành.
 */
export async function issueEInvoiceForOrder(
  orderId: string,
  buyer: InvoiceBuyer | null,
): Promise<EInvoice> {
  const settings = mergeWithDefaultSettings(await getStoredSettings()).eInvoice;
  if (!settings.enabled) {
    throw new UserFacingError('Chưa bật hóa đơn điện tử trong Cài đặt.');
  }
  const provider = getEInvoiceProvider(settings.providerId);
  const collections = await getCollections();

  const order = await collections.orders.findOne<Order>(
    { id: orderId },
    WITHOUT_MONGO_ID,
  );
  if (!order || !isOrderPaid(order)) {
    throw new UserFacingError('Chỉ lập hóa đơn cho đơn đã thanh toán.');
  }
  await assertNoInvoiceYet(order);

  const content = buildEInvoiceContent({
    order,
    buyer,
    settings,
    menuItems: await loadMenuItems(
      collections,
      order.items.map((item) => item.menuItemId),
    ),
    isSandbox: provider.isSandbox,
  });
  const issuedAt = Date.now();
  const series = buildEInvoiceSeries(issuedAt, settings.seriesSuffix);
  const invoice: EInvoice = {
    ...content,
    ...NOT_NUMBERED_YET,
    id: createId(),
    providerId: provider.id,
    series,
    lookupCode: null,
    issuedAt,
    transmission: { status: 'pending', attemptedAt: null, message: null },
  };
  try {
    await collections.einvoices.insertOne({ ...invoice });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      await assertNoInvoiceYet(order);
    }
    throw error;
  }

  if (provider.numbering !== 'local') {
    return invoice;
  }
  const numbering = await assignLocalNumbering(
    collections,
    settings,
    series,
    issuedAt,
  );
  await collections.einvoices.updateOne(
    { id: invoice.id },
    { $set: numbering },
  );
  return { ...invoice, ...numbering };
}

export async function saveEInvoiceTransmitChanges(
  id: string,
  changes: EInvoiceTransmitChanges,
): Promise<void> {
  const { einvoices } = await getCollections();
  const result = await einvoices.updateOne({ id }, { $set: changes });
  if (result.matchedCount === 0) {
    throw new UserFacingError('Không tìm thấy hóa đơn.', 404);
  }
}
