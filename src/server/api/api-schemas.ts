import 'server-only';
import { z } from 'zod';
import { CARD_BRANDS } from '@/data/card-brands';
import { ALL_PERMISSIONS } from '@/data/permissions';
import { VAT_RATE_CODES } from '@/data/vat-rates';
import { PAYMENT_METHODS } from '@/lib/payment-methods';
import type { CashEntryType, CashFund } from '@/types/cash-entry';
import type {
  EInvoiceTransmissionStatus,
  InvoiceBuyerKind,
} from '@/types/einvoice';
import type { ReservationStatus } from '@/types/reservation';

/** Kiểm tra giá trị thuộc danh sách hằng có sẵn, giữ đúng kiểu union của danh sách đó. */
function oneOf<T extends string>(values: readonly T[]) {
  return z.custom<T>(
    (value) =>
      typeof value === 'string' &&
      (values as readonly string[]).includes(value),
    { message: `Phải là một trong: ${values.join(', ')}` },
  );
}

const CASH_ENTRY_TYPES: readonly CashEntryType[] = ['receipt', 'payment'];
const CASH_FUNDS: readonly CashFund[] = ['cash', 'bank'];
const BUYER_KINDS: readonly InvoiceBuyerKind[] = ['company', 'individual'];
const TRANSMISSION_STATUSES: readonly EInvoiceTransmissionStatus[] = [
  'pending',
  'sent',
  'failed',
  'sandbox',
];
const RESERVATION_STATUSES: readonly ReservationStatus[] = [
  'booked',
  'seated',
  'cancelled',
  'noShow',
];

const id = z.string().min(1).max(100);
const shortText = z.string().max(500);
const timestamp = z.number().finite();

export const nameSchema = z.object({ name: shortText });

export const menuItemInputSchema = z.object({
  name: shortText,
  price: z.number(),
  categoryId: z.string().max(100),
  emoji: z.string().max(20),
  isAvailable: z.boolean(),
  barcode: shortText.optional(),
  unit: shortText.optional(),
  vatRate: oneOf(VAT_RATE_CODES).optional(),
});

export const availabilitySchema = z.object({ isAvailable: z.boolean() });

export const diningTableInputSchema = z.object({
  name: shortText,
  seats: z.number(),
});

const orderItemSchema = z.object({
  menuItemId: id,
  name: shortText,
  unitPrice: z.number().int().min(0),
  quantity: z.number().int().min(1).max(999),
  note: shortText,
});

export const placeOrderSchema = z.object({
  tableId: id.nullable(),
  items: z.array(orderItemSchema).max(200),
  pagerNumber: z.number().int().nullable(),
});

export const paymentInputSchema = z.object({
  method: oneOf(PAYMENT_METHODS),
  details: z.object({
    cashReceived: z.number().int().min(0).optional(),
    cardBrand: oneOf(CARD_BRANDS).optional(),
    cardLast4: z.string().max(4).optional(),
    approvalCode: z.string().max(50).optional(),
    transferNote: shortText.optional(),
  }),
});

export const pagerSchema = z.object({
  pagerNumber: z.number().int().nullable(),
});

const invoiceBuyerSchema = z.object({
  kind: oneOf(BUYER_KINDS),
  name: shortText,
  taxCode: z.string().max(20),
  personalId: z.string().max(20),
  address: shortText,
  phone: z.string().max(30),
  email: z.string().max(200),
});

export const issueEInvoiceSchema = z.object({
  buyer: invoiceBuyerSchema.nullable(),
});

export const transmitChangesSchema = z.object({
  transmission: z.object({
    status: oneOf(TRANSMISSION_STATUSES),
    attemptedAt: timestamp.nullable(),
    message: z.string().max(2000).nullable(),
  }),
  series: z.string().max(20).optional(),
  number: z.number().int().optional(),
  taxAuthorityCode: z.string().max(100).optional(),
  lookupCode: z.string().max(100).optional(),
  isSandbox: z.boolean().optional(),
});

export const cashEntryInputSchema = z.object({
  type: oneOf(CASH_ENTRY_TYPES),
  fund: oneOf(CASH_FUNDS),
  categoryId: id,
  amount: z.number(),
  counterparty: shortText,
  note: shortText,
  occurredAt: timestamp,
});

export const staffRoleInputSchema = z.object({
  name: shortText,
  permissions: z.array(oneOf(ALL_PERMISSIONS)),
});

export const employeeInputSchema = z.object({
  name: shortText,
  roleId: id,
  isActive: z.boolean(),
  pin: z.string().max(20),
});

export const unlockStaffSchema = z.object({
  employeeId: id,
  pin: z.string().max(20),
});

export const reservationInputSchema = z.object({
  customerName: shortText,
  phone: z.string().max(30),
  partySize: z.number(),
  reservedAt: timestamp,
  tableId: id.nullable(),
  note: shortText,
});

export const reservationStatusSchema = z.object({
  status: oneOf(RESERVATION_STATUSES),
});
