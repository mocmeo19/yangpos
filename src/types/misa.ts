/** "test": testapi.meinvoice.vn, hóa đơn không gửi cơ quan thuế; "production": api.meinvoice.vn. */
export type MisaEnvironment = 'test' | 'production';

/** Ký hiệu hóa đơn khởi tạo từ máy tính tiền đã đăng ký trên MISA meInvoice. */
export interface MisaSeries {
  /** Mẫu số ghép ký hiệu, vd "1C26MAA". */
  symbol: string;
  name: string;
  /** Mẫu cho phép nhiều thuế suất trên cùng hóa đơn, vd đồ ăn 8% cùng bia 10%. */
  allowsMultipleVatRates: boolean;
}

export type MisaConnectionResult =
  | {
      ok: true;
      environment: MisaEnvironment;
      taxCode: string;
      series: MisaSeries[];
    }
  | { ok: false; error: string };

export interface MisaPublishedInvoice {
  /** Ký hiệu MISA trả về, đã bỏ mẫu số ở đầu; `null` khi MISA không trả. */
  series: string | null;
  number: number;
  taxAuthorityCode: string;
  lookupCode: string;
}

export type MisaPublishResult =
  | { ok: true; environment: MisaEnvironment; invoice: MisaPublishedInvoice }
  | { ok: false; error: string };
