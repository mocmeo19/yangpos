export type CashFund = 'cash' | 'bank';

/** "receipt" là phiếu thu, "payment" là phiếu chi. */
export type CashEntryType = 'receipt' | 'payment';

export interface CashEntry {
  id: string;
  /** Số phiếu tăng dần theo từng loại, vd "PT000001", "PC000001". */
  number: string;
  type: CashEntryType;
  fund: CashFund;
  categoryId: string;
  amount: number;
  /** Người nộp tiền (phiếu thu) hoặc người nhận tiền (phiếu chi). */
  counterparty: string;
  note: string;
  occurredAt: number;
  createdAt: number;
}

export type CashEntryInput = Omit<CashEntry, 'id' | 'number' | 'createdAt'>;

export interface CashCategory {
  id: string;
  label: string;
  type: CashEntryType;
  /** Góp vốn, rút vốn, nộp thuế GTGT là dòng tiền nhưng không phải thu nhập hay chi phí. */
  affectsProfit: boolean;
}
