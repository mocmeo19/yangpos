'use client';

import { createContext } from 'react';
import type { ToastOptions } from '@/types/toast';

export type ShowToast = (options: ToastOptions) => void;

export const ToastContext = createContext<ShowToast | null>(null);
