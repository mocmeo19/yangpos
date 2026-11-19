'use client';

import {
  useCallback,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { OrderDraftContext } from '@/contexts/order-draft-context';
import { cartReducer } from '@/lib/cart-reducer';
import type { CartLine } from '@/types/cart';
import type { ServiceMode } from '@/types/order';
import type { OrderDraft } from '@/types/order-draft';

const EMPTY_CART: CartLine[] = [];

/** Giữ phiếu đang gọi ở cấp layout để không bị mất khi chuyển sang trang khác rồi quay lại. */
export function OrderDraftProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, EMPTY_CART);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('dineIn');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [pagerNumber, setPagerNumber] = useState<number | null>(null);

  const selectTable = useCallback((tableId: string) => {
    setServiceMode('dineIn');
    setSelectedTableId(tableId);
  }, []);

  const resetDraft = useCallback(() => {
    dispatch({ type: 'clear' });
    setSelectedTableId(null);
    setPagerNumber(null);
  }, []);

  const draft = useMemo<OrderDraft>(
    () => ({
      lines,
      dispatch,
      serviceMode,
      setServiceMode,
      selectedTableId,
      selectTable,
      pagerNumber,
      setPagerNumber,
      resetDraft,
    }),
    [lines, serviceMode, selectedTableId, selectTable, pagerNumber, resetDraft],
  );

  return <OrderDraftContext value={draft}>{children}</OrderDraftContext>;
}
