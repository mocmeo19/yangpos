import type { MenuItem } from '@/types/menu';

export function findMenuItemByBarcode(
  menuItems: readonly MenuItem[],
  code: string,
): MenuItem | undefined {
  const normalizedCode = code.trim();
  if (!normalizedCode) {
    return undefined;
  }
  return menuItems.find((menuItem) => menuItem.barcode === normalizedCode);
}
