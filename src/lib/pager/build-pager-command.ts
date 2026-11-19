const PLACEHOLDER_SOURCE = String.raw`\{n(?::(byte|\d{1,2}))?\}`;
const TOKEN_PATTERN = new RegExp(
  String.raw`${PLACEHOLDER_SOURCE}|\\x([0-9a-fA-F]{2})|\\([rnt\\])`,
  'g',
);
const PLACEHOLDER_PATTERN = new RegExp(PLACEHOLDER_SOURCE);
const MAX_BYTE = 255;

const SIMPLE_ESCAPES: Record<string, number> = {
  r: 0x0d,
  n: 0x0a,
  t: 0x09,
  '\\': 0x5c,
};

const encoder = new TextEncoder();

function encodePagerNumber(pagerNumber: number, format: string | undefined) {
  if (format === 'byte') {
    if (pagerNumber > MAX_BYTE) {
      throw new Error(
        `Thẻ số ${pagerNumber} lớn hơn ${MAX_BYTE}, không gửi được dạng 1 byte.`,
      );
    }
    return [pagerNumber];
  }
  const text = format
    ? String(pagerNumber).padStart(Number(format), '0')
    : String(pagerNumber);
  return [...encoder.encode(text)];
}

function encodeToken(match: RegExpExecArray, pagerNumber: number): number[] {
  const [, format, hex, escape] = match;
  if (hex) {
    return [Number.parseInt(hex, 16)];
  }
  if (escape) {
    return [SIMPLE_ESCAPES[escape]];
  }
  return encodePagerNumber(pagerNumber, format);
}

export function hasPagerPlaceholder(template: string): boolean {
  return PLACEHOLDER_PATTERN.test(template);
}

/**
 * Dựng lệnh gọi thẻ từ mẫu lấy trong tài liệu của hãng đế phát: `{n}`, `{n:3}`, `{n:byte}` là số
 * thẻ; `\r`, `\n`, `\t`, `\\`, `\xNN` là byte điều khiển; phần còn lại gửi nguyên văn.
 */
export function buildPagerCommand(
  template: string,
  pagerNumber: number,
): Uint8Array<ArrayBuffer> {
  const bytes: number[] = [];
  let textStart = 0;
  for (const match of template.matchAll(TOKEN_PATTERN)) {
    bytes.push(...encoder.encode(template.slice(textStart, match.index)));
    bytes.push(...encodeToken(match, pagerNumber));
    textStart = match.index + match[0].length;
  }
  bytes.push(...encoder.encode(template.slice(textStart)));
  return Uint8Array.from(bytes);
}
