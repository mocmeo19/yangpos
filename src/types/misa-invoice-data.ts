/** Một dòng hàng hóa theo đối tượng OriginalInvoiceDetail của API tích hợp MISA meInvoice. */
export interface MisaInvoiceDetail {
  /** 1: hàng hóa, dịch vụ. */
  ItemType: number;
  LineNumber: number;
  SortOrder: number;
  ItemName: string;
  UnitName: string;
  Quantity: number;
  UnitPrice: number;
  DiscountRate: number;
  DiscountAmountOC: number;
  DiscountAmount: number;
  AmountOC: number;
  Amount: number;
  AmountWithoutVATOC: number;
  AmountWithoutVAT: number;
  UnitPriceAfterTax: number;
  AmountAfterTax: number;
  /** `null` trên hóa đơn bán hàng vì không ghi thuế suất. */
  VATRateName: string | null;
  VATAmountOC: number;
  VATAmount: number;
}

export interface MisaTaxRateInfo {
  VATRateName: string;
  AmountWithoutVATOC: number;
  VATAmountOC: number;
}

/** Số chữ số thập phân MISA dùng khi trình bày hóa đơn. */
export interface MisaOptionUserDefined {
  MainCurrency: string;
  AmountDecimalDigits: string;
  AmountOCDecimalDigits: string;
  UnitPriceOCDecimalDigits: string;
  UnitPriceDecimalDigits: string;
  QuantityDecimalDigits: string;
}

/** Đối tượng InvoiceData phát hành với SignType 5: hóa đơn máy tính tiền, không ký số. */
export interface MisaInvoiceData {
  /** Mã hóa đơn phía máy bán hàng; MISA dựa vào đây để không phát hành trùng khi gửi lại. */
  RefID: string;
  /** Mẫu số ghép ký hiệu, vd "1C26MAA". */
  InvSeries: string;
  /** yyyy-MM-dd. */
  InvDate: string;
  CurrencyCode: 'VND';
  ExchangeRate: number;
  PaymentMethodName: string;
  IsInvoiceCalculatingMachine: true;
  BuyerLegalName: string;
  BuyerTaxCode: string;
  BuyerAddress: string;
  BuyerFullName: string;
  BuyerPhoneNumber: string;
  BuyerEmail: string;
  /** Số định danh cá nhân (số căn cước) của người mua là cá nhân. */
  AccountObjectIdentificationNumber: string;
  IsSendEmail: boolean;
  ReceiverName: string;
  ReceiverEmail: string;
  TotalSaleAmountOC: number;
  TotalSaleAmount: number;
  DiscountRate: number;
  TotalDiscountAmountOC: number;
  TotalDiscountAmount: number;
  TotalAmountWithoutVATOC: number;
  TotalAmountWithoutVAT: number;
  TotalVATAmountOC: number;
  TotalVATAmount: number;
  TotalAmountOC: number;
  TotalAmount: number;
  TotalAmountInWords: string;
  OriginalInvoiceDetail: MisaInvoiceDetail[];
  TaxRateInfo: MisaTaxRateInfo[];
  OptionUserDefined: MisaOptionUserDefined;
}
