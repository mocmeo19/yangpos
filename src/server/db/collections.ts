import 'server-only';
import type { Collection } from 'mongodb';
import type { CashEntry } from '@/types/cash-entry';
import type { Counter } from '@/types/counter';
import type { DiningTable } from '@/types/dining-table';
import type { EInvoice } from '@/types/einvoice';
import type { Category, MenuItem } from '@/types/menu';
import type { Order } from '@/types/order';
import type { Reservation } from '@/types/reservation';
import type { StoredSettings } from '@/types/settings';
import type { EmployeeRecord, StaffRole } from '@/types/staff';
import { ensureDatabaseReady } from './ensure-database';
import { getMongoDb } from './mongo-client';

export interface PosCollections {
  categories: Collection<Category>;
  menuItems: Collection<MenuItem>;
  diningTables: Collection<DiningTable>;
  orders: Collection<Order>;
  settings: Collection<StoredSettings>;
  einvoices: Collection<EInvoice>;
  cashEntries: Collection<CashEntry>;
  counters: Collection<Counter>;
  staffRoles: Collection<StaffRole>;
  employees: Collection<EmployeeRecord>;
  reservations: Collection<Reservation>;
}

/**
 * Bản ghi dùng trường `id` (chuỗi) của ứng dụng làm khóa; `_id` do MongoDB tự sinh nên luôn được
 * bỏ khi đọc để dữ liệu trả về giống hệt kiểu trong `src/types`.
 */
export const WITHOUT_MONGO_ID = { projection: { _id: 0 } } as const;

export async function getCollections(): Promise<PosCollections> {
  const db = await getMongoDb();
  const collections: PosCollections = {
    categories: db.collection('categories'),
    menuItems: db.collection('menuItems'),
    diningTables: db.collection('diningTables'),
    orders: db.collection('orders'),
    settings: db.collection('settings'),
    einvoices: db.collection('einvoices'),
    cashEntries: db.collection('cashEntries'),
    counters: db.collection('counters'),
    staffRoles: db.collection('staffRoles'),
    employees: db.collection('employees'),
    reservations: db.collection('reservations'),
  };
  await ensureDatabaseReady(collections);
  return collections;
}
