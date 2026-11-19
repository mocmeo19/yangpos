'use client';

import { LoadingState } from '@/components/ui/LoadingState';
import { useActiveOrders } from '@/hooks/use-active-orders';
import { useCategories } from '@/hooks/use-categories';
import { useDiningTables } from '@/hooks/use-dining-tables';
import { useMenuItems } from '@/hooks/use-menu-items';
import { PosWorkspace } from './PosWorkspace';

export function PosScreen() {
  const categories = useCategories();
  const menuItems = useMenuItems();
  const tables = useDiningTables();
  const activeOrders = useActiveOrders();

  if (!categories || !menuItems || !tables || !activeOrders) {
    return <LoadingState />;
  }

  return (
    <PosWorkspace
      categories={categories}
      menuItems={menuItems}
      tables={tables}
      activeOrders={activeOrders}
    />
  );
}
