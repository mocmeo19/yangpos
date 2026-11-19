import type { SpreadsheetRow } from '@/types/spreadsheet';
import { buildWorksheetXml } from './build-worksheet-xml';
import { createStoredZip } from './create-stored-zip';
import { escapeXml } from './escape-xml';
import {
  DOCUMENT_RELATIONSHIPS_NAMESPACE,
  PACKAGE_RELATIONSHIPS_NAMESPACE,
  SPREADSHEET_NAMESPACE,
  XML_DECLARATION,
} from './ooxml-constants';
import { STYLES_XML } from './xlsx-styles';

export const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const MAX_SHEET_NAME_LENGTH = 31;
const INVALID_SHEET_NAME_CHARS = /[\\/?*[\]:]/g;
const DEFAULT_SHEET_NAME = 'Sheet1';

const CONTENT_TYPES_XML = `${XML_DECLARATION}
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;

const ROOT_RELATIONSHIPS_XML = `${XML_DECLARATION}
<Relationships xmlns="${PACKAGE_RELATIONSHIPS_NAMESPACE}"><Relationship Id="rId1" Type="${DOCUMENT_RELATIONSHIPS_NAMESPACE}/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

const WORKBOOK_RELATIONSHIPS_XML = `${XML_DECLARATION}
<Relationships xmlns="${PACKAGE_RELATIONSHIPS_NAMESPACE}"><Relationship Id="rId1" Type="${DOCUMENT_RELATIONSHIPS_NAMESPACE}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${DOCUMENT_RELATIONSHIPS_NAMESPACE}/styles" Target="styles.xml"/></Relationships>`;

/** Excel từ chối mở tệp có tên trang tính dài quá 31 ký tự hoặc chứa \ / ? * [ ] :. */
function toSheetName(name: string): string {
  const cleaned = name
    .replace(INVALID_SHEET_NAME_CHARS, ' ')
    .trim()
    .slice(0, MAX_SHEET_NAME_LENGTH);
  return cleaned || DEFAULT_SHEET_NAME;
}

function buildWorkbookXml(sheetName: string): string {
  return `${XML_DECLARATION}
<workbook xmlns="${SPREADSHEET_NAMESPACE}" xmlns:r="${DOCUMENT_RELATIONSHIPS_NAMESPACE}"><sheets><sheet name="${escapeXml(toSheetName(sheetName))}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

/**
 * Tệp Excel một trang tính, dòng đầu của `rows` là tiêu đề. Dùng .xlsx thay cho CSV vì Excel cài
 * tiếng Việt tách cột bằng dấu ";" nên CSV dễ bị dồn hết vào một cột.
 */
export function buildXlsx(
  sheetName: string,
  rows: readonly SpreadsheetRow[],
): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const parts: Record<string, string> = {
    '[Content_Types].xml': CONTENT_TYPES_XML,
    '_rels/.rels': ROOT_RELATIONSHIPS_XML,
    'xl/workbook.xml': buildWorkbookXml(sheetName),
    'xl/_rels/workbook.xml.rels': WORKBOOK_RELATIONSHIPS_XML,
    'xl/styles.xml': STYLES_XML,
    'xl/worksheets/sheet1.xml': buildWorksheetXml(rows),
  };
  return createStoredZip(
    Object.entries(parts).map(([path, xml]) => ({
      path,
      data: encoder.encode(xml),
    })),
  );
}
