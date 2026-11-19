import type { CustomerDisplayMessage } from '@/types/customer-display';

export const CUSTOMER_DISPLAY_PATH = '/customer-display';
export const CUSTOMER_DISPLAY_WINDOW_NAME = 'yangpos-customer-display';

const CHANNEL_NAME = 'yangpos:customer-display';

/**
 * Máy bán hàng và màn hình khách là hai cửa sổ của cùng trình duyệt nên trao đổi qua
 * BroadcastChannel, không cần server. Trả về `null` khi trình duyệt không hỗ trợ.
 */
export function openCustomerDisplayChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') {
    return null;
  }
  return new BroadcastChannel(CHANNEL_NAME);
}

export function isCustomerDisplayMessage(
  value: unknown,
): value is CustomerDisplayMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.type === 'request') {
    return true;
  }
  return (
    candidate.type === 'snapshot' &&
    typeof candidate.snapshot === 'object' &&
    candidate.snapshot !== null &&
    Array.isArray((candidate.snapshot as Record<string, unknown>).lines)
  );
}
