import { NAVIGATION_ITEMS } from '@/data/navigation';
import type { NavigationItem } from '@/types/navigation';
import { isNavItemActive } from './is-nav-item-active';

export function findNavItemForPath(
  pathname: string,
): NavigationItem | undefined {
  return NAVIGATION_ITEMS.find((item) => isNavItemActive(pathname, item.href));
}
