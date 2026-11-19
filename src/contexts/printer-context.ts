'use client';

import { createContext } from 'react';
import type { ReceiptPrinter } from '@/types/printer';

export const PrinterContext = createContext<ReceiptPrinter | null>(null);
