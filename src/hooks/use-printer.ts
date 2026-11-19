'use client';

import { useContext } from 'react';
import { PrinterContext } from '@/contexts/printer-context';
import type { ReceiptPrinter } from '@/types/printer';

export function usePrinter(): ReceiptPrinter {
  const printer = useContext(PrinterContext);
  if (!printer) {
    throw new Error('usePrinter phải được dùng bên trong PrinterProvider.');
  }
  return printer;
}
