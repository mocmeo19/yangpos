'use client';

import { useContext } from 'react';
import { ToastContext, type ShowToast } from '@/contexts/toast-context';

export function useToast(): ShowToast {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error('useToast phải được dùng bên trong ToastProvider.');
  }
  return showToast;
}
