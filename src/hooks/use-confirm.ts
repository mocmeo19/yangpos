'use client';

import { useContext } from 'react';
import {
  ConfirmContext,
  type RequestConfirm,
} from '@/contexts/confirm-context';

export function useConfirm(): RequestConfirm {
  const requestConfirm = useContext(ConfirmContext);
  if (!requestConfirm) {
    throw new Error('useConfirm phải được dùng bên trong ConfirmProvider.');
  }
  return requestConfirm;
}
