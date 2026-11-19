'use client';

import { useContext } from 'react';
import { OrderDraftContext } from '@/contexts/order-draft-context';
import type { OrderDraft } from '@/types/order-draft';

export function useOrderDraft(): OrderDraft {
  const draft = useContext(OrderDraftContext);
  if (!draft) {
    throw new Error(
      'useOrderDraft phải được dùng bên trong OrderDraftProvider.',
    );
  }
  return draft;
}
