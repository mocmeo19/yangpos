'use client';

import type { ReactNode } from 'react';
import { CustomerDisplayBroadcaster } from '@/components/customer-display/CustomerDisplayBroadcaster';
import { ConfirmProvider } from '@/components/feedback/ConfirmProvider';
import { ToastProvider } from '@/components/feedback/ToastProvider';
import { OrderDraftProvider } from '@/components/pos/OrderDraftProvider';
import { PrinterProvider } from '@/components/printing/PrinterProvider';
import { SettingsProvider } from '@/components/settings/SettingsProvider';
import { StaffSessionProvider } from '@/components/staff/StaffSessionProvider';

export function PosProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <StaffSessionProvider>
          <SettingsProvider>
            <PrinterProvider>
              <OrderDraftProvider>
                <CustomerDisplayBroadcaster />
                {children}
              </OrderDraftProvider>
            </PrinterProvider>
          </SettingsProvider>
        </StaffSessionProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
