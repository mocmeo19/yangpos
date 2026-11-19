'use client';

import { createContext } from 'react';
import type { OrderDraft } from '@/types/order-draft';

export const OrderDraftContext = createContext<OrderDraft | null>(null);
