import { SPREADSHEET_NAMESPACE, XML_DECLARATION } from './ooxml-constants';

/** Vị trí kiểu ô trong `cellXfs` bên dưới, dùng cho thuộc tính `s` của từng ô. */
export const CELL_STYLE = {
  header: 1,
  number: 2,
} as const;

// numFmtId 3 là định dạng có sẵn "#,##0": Excel tự dùng dấu phân cách hàng nghìn theo máy người dùng.
export const STYLES_XML = `${XML_DECLARATION}
<styleSheet xmlns="${SPREADSHEET_NAMESPACE}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
