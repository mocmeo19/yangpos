import 'server-only';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { getCollections, WITHOUT_MONGO_ID } from '@/server/db/collections';
import type { MenuItem, MenuItemInput } from '@/types/menu';

// Trường tùy chọn: để trống thì xóa hẳn khỏi bản ghi thay vì lưu chuỗi rỗng.
const OPTIONAL_FIELDS = ['barcode', 'unit', 'vatRate'] as const;

/**
 * Để trống thay vì chuỗi rỗng: chỉ mục mã vạch là duy nhất, còn đơn vị tính trống thì hóa đơn
 * dùng đơn vị mặc định.
 */
function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function validateMenuItem(input: MenuItemInput): MenuItemInput {
  const name = input.name.trim();
  if (!name) {
    throw new UserFacingError('Tên món không được để trống.');
  }
  if (!Number.isInteger(input.price) || input.price < 0) {
    throw new UserFacingError('Giá món phải là số nguyên không âm.');
  }
  if (!input.categoryId) {
    throw new UserFacingError('Vui lòng chọn danh mục cho món.');
  }
  return {
    ...input,
    name,
    emoji: input.emoji.trim() || '🍽️',
    barcode: normalizeOptionalText(input.barcode),
    unit: normalizeOptionalText(input.unit),
  };
}

export async function listMenuItems(): Promise<MenuItem[]> {
  const { menuItems } = await getCollections();
  return menuItems
    .find<MenuItem>({}, { ...WITHOUT_MONGO_ID, sort: { createdAt: 1 } })
    .toArray();
}

async function assertBarcodeAvailable(
  barcode: string | undefined,
  currentId?: string,
): Promise<void> {
  if (!barcode) {
    return;
  }
  const { menuItems } = await getCollections();
  const owner = await menuItems.findOne<MenuItem>(
    { barcode },
    WITHOUT_MONGO_ID,
  );
  if (owner && owner.id !== currentId) {
    throw new UserFacingError(
      `Mã vạch ${barcode} đang được dùng cho món "${owner.name}".`,
    );
  }
}

async function assertCategoryExists(categoryId: string): Promise<void> {
  const { categories } = await getCollections();
  if (!(await categories.countDocuments({ id: categoryId }))) {
    throw new UserFacingError('Danh mục không tồn tại, vui lòng chọn lại.');
  }
}

// Mã vạch trùng do hai máy lưu cùng lúc vẫn bị chỉ mục duy nhất chặn lại ở tầng database.
export async function addMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const validInput = validateMenuItem(input);
  await assertCategoryExists(validInput.categoryId);
  await assertBarcodeAvailable(validInput.barcode);
  const menuItem: MenuItem = {
    ...validInput,
    id: createId(),
    createdAt: Date.now(),
  };
  const { menuItems } = await getCollections();
  await menuItems.insertOne({ ...menuItem });
  return menuItem;
}

export async function updateMenuItem(
  id: string,
  input: MenuItemInput,
): Promise<void> {
  const validInput = validateMenuItem(input);
  await assertCategoryExists(validInput.categoryId);
  await assertBarcodeAvailable(validInput.barcode, id);
  const unset: Partial<Record<(typeof OPTIONAL_FIELDS)[number], ''>> = {};
  for (const field of OPTIONAL_FIELDS) {
    if (validInput[field] === undefined) {
      unset[field] = '';
    }
  }
  const { menuItems } = await getCollections();
  await menuItems.updateOne({ id }, { $set: validInput, $unset: unset });
}

export async function setMenuItemAvailability(
  id: string,
  isAvailable: boolean,
): Promise<void> {
  const { menuItems } = await getCollections();
  await menuItems.updateOne({ id }, { $set: { isAvailable } });
}

/** Đơn cũ vẫn giữ tên và giá đã chụp lại nên xóa món không ảnh hưởng lịch sử. */
export async function deleteMenuItem(id: string): Promise<void> {
  const { menuItems } = await getCollections();
  await menuItems.deleteOne({ id });
}
