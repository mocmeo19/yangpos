import type { SpreadsheetCell, SpreadsheetRow } from '@/types/spreadsheet';
import { escapeXml } from './escape-xml';
import { SPREADSHEET_NAMESPACE, XML_DECLARATION } from './ooxml-constants';
import { CELL_STYLE } from './xlsx-styles';

const MIN_COLUMN_WIDTH = 6;
const MAX_COLUMN_WIDTH = 60;
const COLUMN_PADDING = 2;

const numberFormatter = new Intl.NumberFormat('vi-VN');

/** Chỉ số cột bắt đầu từ 0 thành tên cột Excel: 0 → A, 25 → Z, 26 → AA. */
function toColumnName(index: number): string {
  let name = '';
  for (let rest = index + 1; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    name = String.fromCharCode(65 + ((rest - 1) % 26)) + name;
  }
  return name;
}

function toCellXml(
  cell: SpreadsheetCell,
  reference: string,
  isHeader: boolean,
): string {
  if (typeof cell === 'number') {
    const style = isHeader ? CELL_STYLE.header : CELL_STYLE.number;
    return `<c r="${reference}" s="${style}"><v>${cell}</v></c>`;
  }
  const style = isHeader ? ` s="${CELL_STYLE.header}"` : '';
  return `<c r="${reference}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(cell)}</t></is></c>`;
}

function measureCell(cell: SpreadsheetCell): number {
  if (typeof cell === 'number') {
    return numberFormatter.format(cell).length;
  }
  return cell.length;
}

function buildColumnsXml(rows: readonly SpreadsheetRow[]): string {
  const widths: number[] = [];
  for (const row of rows) {
    row.forEach((cell, index) => {
      widths[index] = Math.max(widths[index] ?? 0, measureCell(cell));
    });
  }
  if (widths.length === 0) {
    return '';
  }
  const columns = Array.from(widths, (width = 0, index) => {
    const fitted = Math.min(
      MAX_COLUMN_WIDTH,
      Math.max(MIN_COLUMN_WIDTH, width + COLUMN_PADDING),
    );
    return `<col min="${index + 1}" max="${index + 1}" width="${fitted}" customWidth="1"/>`;
  });
  return `<cols>${columns.join('')}</cols>`;
}

function buildRowXml(row: SpreadsheetRow, rowIndex: number): string {
  const rowNumber = rowIndex + 1;
  const cells = row
    .map((cell, columnIndex) => {
      if (cell === '') {
        return '';
      }
      const reference = `${toColumnName(columnIndex)}${rowNumber}`;
      return toCellXml(cell, reference, rowIndex === 0);
    })
    .join('');
  return `<row r="${rowNumber}">${cells}</row>`;
}

/** Dòng đầu tiên là tiêu đề: in đậm và được cố định khi cuộn bảng. */
export function buildWorksheetXml(rows: readonly SpreadsheetRow[]): string {
  const frozenHeader =
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
  return `${XML_DECLARATION}
<worksheet xmlns="${SPREADSHEET_NAMESPACE}">${frozenHeader}${buildColumnsXml(rows)}<sheetData>${rows.map(buildRowXml).join('')}</sheetData></worksheet>`;
}
