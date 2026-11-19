import type { MenuItem } from '@/types/menu';
import { normalizeSearchText } from './normalize-search-text';

export const ALL_CATEGORIES = 'all';

interface MenuItemFilter {
  categoryId: string;
  keyword: string;
}

export function filterMenuItems(
  items: readonly MenuItem[],
  { categoryId, keyword }: MenuItemFilter,
): MenuItem[] {
  const normalizedKeyword = normalizeSearchText(keyword);
  const trimmedKeyword = keyword.trim();

  return items.filter((item) => {
    const matchesCategory =
      categoryId === ALL_CATEGORIES || item.categoryId === categoryId;
    const matchesKeyword =
      !normalizedKeyword ||
      normalizeSearchText(item.name).includes(normalizedKeyword) ||
      item.barcode === trimmedKeyword;
    return matchesCategory && matchesKeyword;
  });
}
