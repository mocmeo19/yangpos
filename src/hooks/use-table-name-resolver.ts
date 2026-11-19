'use client';

import { useMemo } from 'react';
import { useDiningTables } from './use-dining-tables';

export const TAKEAWAY_LABEL = 'Mang đi';

/** Trả về hàm tra tên bàn; bàn đã bị xóa vẫn hiển thị được thay vì để trống. */
export function useTableNameResolver(): (tableId: string | null) => string {
  const tables = useDiningTables();

  return useMemo(() => {
    const names = new Map(tables?.map((table) => [table.id, table.name]));
    return (tableId: string | null) => {
      if (!tableId) {
        return TAKEAWAY_LABEL;
      }
      return names.get(tableId) ?? 'Bàn đã xóa';
    };
  }, [tables]);
}
