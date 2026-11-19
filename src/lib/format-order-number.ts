export function formatOrderNumber(orderNumber: number): string {
  return `#${String(orderNumber).padStart(4, '0')}`;
}
