'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ToastContext } from '@/contexts/toast-context';
import type { Toast, ToastOptions } from '@/types/toast';
import { ToastViewport } from './ToastViewport';

const TOAST_DURATION_MS = 4000;
const MAX_VISIBLE_TOASTS = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      nextIdRef.current += 1;
      const id = nextIdRef.current;
      const toast: Toast = { ...options, id, tone: options.tone ?? 'success' };

      setToasts((current) => [...current, toast].slice(-MAX_VISIBLE_TOASTS));
      timersRef.current.set(
        id,
        setTimeout(() => dismissToast(id), TOAST_DURATION_MS),
      );
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext value={showToast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext>
  );
}
