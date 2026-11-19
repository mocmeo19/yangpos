import type { CartAction, CartLine } from '@/types/cart';

function changeQuantity(
  lines: CartLine[],
  menuItemId: string,
  delta: number,
): CartLine[] {
  return lines
    .map((line) =>
      line.menuItemId === menuItemId
        ? { ...line, quantity: line.quantity + delta }
        : line,
    )
    .filter((line) => line.quantity > 0);
}

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const { menuItem } = action;
      const exists = lines.some((line) => line.menuItemId === menuItem.id);
      if (exists) {
        return changeQuantity(lines, menuItem.id, 1);
      }
      return [
        ...lines,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          unitPrice: menuItem.price,
          quantity: 1,
          note: '',
          emoji: menuItem.emoji,
        },
      ];
    }
    case 'changeQuantity':
      return changeQuantity(lines, action.menuItemId, action.delta);
    case 'setNote':
      return lines.map((line) =>
        line.menuItemId === action.menuItemId
          ? { ...line, note: action.note }
          : line,
      );
    case 'remove':
      return lines.filter((line) => line.menuItemId !== action.menuItemId);
    case 'clear':
      return [];
  }
}
