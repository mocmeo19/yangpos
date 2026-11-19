import { PAYMENT_METHOD_LABELS } from '@/lib/payment-methods';
import type {
  EInvoice,
  EInvoiceLine,
  EInvoiceTaxLine,
  InvoiceBuyer,
  VatRateCode,
} from '@/types/einvoice';
import type {
  MisaInvoiceData,
  MisaInvoiceDetail,
  MisaTaxRateInfo,
} from '@/types/misa-invoice-data';

type MisaBuyerFields = Pick<
  MisaInvoiceData,
  | 'BuyerLegalName'
  | 'BuyerTaxCode'
  | 'BuyerAddress'
  | 'BuyerFullName'
  | 'BuyerPhoneNumber'
  | 'BuyerEmail'
  | 'AccountObjectIdentificationNumber'
  | 'IsSendEmail'
  | 'ReceiverName'
  | 'ReceiverEmail'
>;

/** Tên thuế suất theo chuẩn dữ liệu hóa đơn của cơ quan thuế mà MISA nhận. */
const MISA_VAT_RATE_NAMES: Record<VatRateCode, string> = {
  '10': '10%',
  '8': '8%',
  '5': '5%',
  '0': '0%',
  KCT: 'KCT',
  KKKNT: 'KKKNT',
};

const GOODS_ITEM_TYPE = 1;
const UNIT_PRICE_DECIMALS = 2;

const WALK_IN_BUYER: MisaBuyerFields = {
  BuyerLegalName: '',
  BuyerTaxCode: '',
  BuyerAddress: '',
  BuyerFullName: '',
  BuyerPhoneNumber: '',
  BuyerEmail: '',
  AccountObjectIdentificationNumber: '',
  IsSendEmail: false,
  ReceiverName: '',
  ReceiverEmail: '',
};

function padTwoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

/** Ngày hóa đơn dạng yyyy-MM-dd theo giờ của máy bán hàng. */
function formatInvoiceDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function toDetail(line: EInvoiceLine, index: number): MisaInvoiceDetail {
  const vatAmount = line.amount - line.amountBeforeTax;
  return {
    ItemType: GOODS_ITEM_TYPE,
    LineNumber: index + 1,
    SortOrder: index + 1,
    ItemName: line.name,
    UnitName: line.unit,
    Quantity: line.quantity,
    // Giá thực đơn đã gồm thuế nên đơn giá chưa thuế có thể lẻ; giữ 2 số lẻ để thành tiền vẫn khớp.
    UnitPrice: roundTo(
      line.amountBeforeTax / line.quantity,
      UNIT_PRICE_DECIMALS,
    ),
    DiscountRate: 0,
    DiscountAmountOC: 0,
    DiscountAmount: 0,
    AmountOC: line.amountBeforeTax,
    Amount: line.amountBeforeTax,
    AmountWithoutVATOC: line.amountBeforeTax,
    AmountWithoutVAT: line.amountBeforeTax,
    UnitPriceAfterTax: line.unitPrice,
    AmountAfterTax: line.amount,
    VATRateName: line.vatRate ? MISA_VAT_RATE_NAMES[line.vatRate] : null,
    VATAmountOC: vatAmount,
    VATAmount: vatAmount,
  };
}

function toTaxRateInfo(taxLine: EInvoiceTaxLine): MisaTaxRateInfo {
  return {
    VATRateName: MISA_VAT_RATE_NAMES[taxLine.vatRate],
    AmountWithoutVATOC: taxLine.amountBeforeTax,
    VATAmountOC: taxLine.vatAmount,
  };
}

function toBuyerFields(buyer: InvoiceBuyer | null): MisaBuyerFields {
  if (!buyer) {
    return WALK_IN_BUYER;
  }
  const isCompany = buyer.kind === 'company';
  return {
    BuyerLegalName: isCompany ? buyer.name : '',
    BuyerFullName: isCompany ? '' : buyer.name,
    BuyerTaxCode: buyer.taxCode,
    BuyerAddress: buyer.address,
    BuyerPhoneNumber: buyer.phone,
    BuyerEmail: buyer.email,
    AccountObjectIdentificationNumber: buyer.personalId,
    // Người mua để lại email thì MISA gửi hóa đơn cho họ ngay khi phát hành xong.
    IsSendEmail: buyer.email.length > 0,
    ReceiverName: buyer.name,
    ReceiverEmail: buyer.email,
  };
}

/**
 * Chuyển hóa đơn trong máy sang đối tượng InvoiceData của MISA. Tiền chưa thuế, tiền thuế từng
 * dòng và từng thuế suất lấy nguyên từ hóa đơn đã tính nên tổng trên MISA khớp từng đồng với bản in.
 */
export function buildMisaInvoiceData(invoice: EInvoice): MisaInvoiceData {
  return {
    RefID: invoice.id,
    InvSeries: `${invoice.template}${invoice.series}`,
    InvDate: formatInvoiceDate(invoice.issuedAt),
    CurrencyCode: 'VND',
    ExchangeRate: 1,
    PaymentMethodName: PAYMENT_METHOD_LABELS[invoice.paymentMethod],
    IsInvoiceCalculatingMachine: true,
    ...toBuyerFields(invoice.buyer),
    TotalSaleAmountOC: invoice.totalBeforeTax,
    TotalSaleAmount: invoice.totalBeforeTax,
    DiscountRate: 0,
    TotalDiscountAmountOC: 0,
    TotalDiscountAmount: 0,
    TotalAmountWithoutVATOC: invoice.totalBeforeTax,
    TotalAmountWithoutVAT: invoice.totalBeforeTax,
    TotalVATAmountOC: invoice.totalVat,
    TotalVATAmount: invoice.totalVat,
    TotalAmountOC: invoice.totalAmount,
    TotalAmount: invoice.totalAmount,
    TotalAmountInWords: `${invoice.totalInWords}.`,
    OriginalInvoiceDetail: invoice.lines.map(toDetail),
    TaxRateInfo: invoice.taxLines.map(toTaxRateInfo),
    OptionUserDefined: {
      MainCurrency: 'VND',
      AmountDecimalDigits: '0',
      AmountOCDecimalDigits: '0',
      UnitPriceOCDecimalDigits: String(UNIT_PRICE_DECIMALS),
      UnitPriceDecimalDigits: String(UNIT_PRICE_DECIMALS),
      QuantityDecimalDigits: '0',
    },
  };
}
