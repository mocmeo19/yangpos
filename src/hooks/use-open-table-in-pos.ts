'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useOrderDraft } from './use-order-draft';

/** Chọn sẵn bàn trong phiếu đang gọi rồi chuyển sang màn hình bán hàng. */
export function useOpenTableInPos(): (tableId: string) => void {
  const router = useRouter();
  const { selectTable } = useOrderDraft();

  return useCallback(
    (tableId: string) => {
      selectTable(tableId);
      router.push('/');
    },
    [router, selectTable],
  );
}
