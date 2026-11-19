import type { PaymentMethod } from './order';

export interface TopSellingItem {
  menuItemId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface SalesReport {
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  itemsSold: number;
  topItems: TopSellingItem[];
  revenueByPaymentMethod: Record<PaymentMethod, number>;
}
