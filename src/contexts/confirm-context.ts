'use client';

import { createContext } from 'react';
import type { ConfirmOptions } from '@/types/confirm';

export type RequestConfirm = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<RequestConfirm | null>(null);
