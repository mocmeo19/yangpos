import 'server-only';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { getCollections, WITHOUT_MONGO_ID } from '@/server/db/collections';
import type { Category } from '@/types/menu';

function requireName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new UserFacingError('Tên danh mục không được để trống.');
  }
  return trimmed;
}

export async function listCategories(): Promise<Category[]> {
  const { categories } = await getCollections();
  return categories
    .find<Category>({}, { ...WITHOUT_MONGO_ID, sort: { sortOrder: 1 } })
    .toArray();
}

export async function addCategory(name: string): Promise<Category> {
  const validName = requireName(name);
  const collections = await getCollections();
  const last = await collections.categories.findOne<Category>(
    {},
    { ...WITHOUT_MONGO_ID, sort: { sortOrder: -1 } },
  );
  const category: Category = {
    id: createId(),
    name: validName,
    sortOrder: (last?.sortOrder ?? -1) + 1,
  };
  await collections.categories.insertOne({ ...category });
  return category;
}

export async function renameCategory(id: string, name: string): Promise<void> {
  const { categories } = await getCollections();
  await categories.updateOne({ id }, { $set: { name: requireName(name) } });
}

export async function deleteCategory(id: string): Promise<void> {
  const collections = await getCollections();
  const itemCount = await collections.menuItems.countDocuments({
    categoryId: id,
  });
  if (itemCount > 0) {
    throw new UserFacingError(
      `Danh mục còn ${itemCount} món. Hãy chuyển hoặc xóa các món này trước.`,
    );
  }
  await collections.categories.deleteOne({ id });
}
