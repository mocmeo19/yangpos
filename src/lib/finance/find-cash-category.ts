import { CASH_CATEGORIES } from '@/data/cash-categories';
import type { CashCategory } from '@/types/cash-entry';

export function findCashCategory(id: string): CashCategory | undefined {
  return CASH_CATEGORIES.find((category) => category.id === id);
}
