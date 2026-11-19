import 'server-only';
import {
  DEFAULT_OWNER_NAME,
  DEFAULT_OWNER_PIN_CREDENTIAL,
  DEFAULT_STAFF_ROLES,
  OWNER_ROLE_ID,
} from '@/data/default-staff';
import { createId } from '@/lib/create-id';
import type { DiningTable } from '@/types/dining-table';
import type { Category, MenuItem } from '@/types/menu';
import type { EmployeeRecord } from '@/types/staff';
import type { PosCollections } from './collections';
import { SEED_MENU, SEED_TABLE_COUNT, SEED_TABLE_SEATS } from './seed-data';

function buildMenu(now: number): {
  categories: Category[];
  menuItems: MenuItem[];
} {
  const categories: Category[] = [];
  const menuItems: MenuItem[] = [];
  SEED_MENU.forEach((seedCategory, categoryIndex) => {
    const category: Category = {
      id: createId(),
      name: seedCategory.name,
      sortOrder: categoryIndex,
    };
    categories.push(category);
    for (const seedItem of seedCategory.items) {
      menuItems.push({
        ...seedItem,
        id: createId(),
        categoryId: category.id,
        isAvailable: true,
        // Thực đơn được sắp theo createdAt nên mỗi món cần một mốc riêng, tăng dần.
        createdAt: now + menuItems.length,
      });
    }
  });
  return { categories, menuItems };
}

function buildTables(): DiningTable[] {
  return Array.from({ length: SEED_TABLE_COUNT }, (_, index) => ({
    id: createId(),
    name: `Bàn ${index + 1}`,
    seats: SEED_TABLE_SEATS,
    sortOrder: index,
  }));
}

/** Dữ liệu mẫu cho cửa hàng mới: thực đơn, bàn, các vai trò và tài khoản chủ cửa hàng. */
export async function seedDatabase(collections: PosCollections): Promise<void> {
  const now = Date.now();
  const { categories, menuItems } = buildMenu(now);
  const owner: EmployeeRecord = {
    id: createId(),
    name: DEFAULT_OWNER_NAME,
    roleId: OWNER_ROLE_ID,
    pin: DEFAULT_OWNER_PIN_CREDENTIAL,
    isActive: true,
    createdAt: now,
  };
  await Promise.all([
    collections.categories.insertMany(categories),
    collections.menuItems.insertMany(menuItems),
    collections.diningTables.insertMany(buildTables()),
    collections.staffRoles.insertMany(
      DEFAULT_STAFF_ROLES.map((role) => ({ ...role })),
    ),
    collections.employees.insertOne(owner),
  ]);
}
