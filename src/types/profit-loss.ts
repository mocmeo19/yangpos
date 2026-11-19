export interface ProfitLossExpense {
  categoryId: string;
  label: string;
  amount: number;
}

export interface ProfitLoss {
  grossRevenue: number;
  outputVat: number;
  netRevenue: number;
  otherIncome: number;
  expenses: ProfitLossExpense[];
  totalExpenses: number;
  profit: number;
  orderCount: number;
  uninvoicedOrderCount: number;
  uninvoicedRevenue: number;
}
