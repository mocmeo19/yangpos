import { formatFullDateTime } from '@/lib/format-time';
import type { CashBook } from '@/types/cash-book';
import type { SpreadsheetRow } from '@/types/spreadsheet';

const HEADER: SpreadsheetRow = [
  'Ngày',
  'Số phiếu',
  'Diễn giải',
  'Thu',
  'Chi',
  'Tồn',
];

export function buildCashBookRows(book: CashBook): SpreadsheetRow[] {
  return [
    HEADER,
    ['', '', 'Tồn đầu kỳ', '', '', book.openingBalance],
    ...book.rows.map((row) => [
      formatFullDateTime(row.occurredAt),
      row.reference,
      row.description,
      row.receipt || '',
      row.payment || '',
      row.balance,
    ]),
    [
      '',
      '',
      'Cộng phát sinh trong kỳ',
      book.totalReceipts,
      book.totalPayments,
      '',
    ],
    ['', '', 'Tồn cuối kỳ', '', '', book.closingBalance],
  ];
}
