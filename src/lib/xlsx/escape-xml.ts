const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

/** XML 1.0 cấm ký tự điều khiển (trừ tab, xuống dòng); chúng có thể lọt vào ghi chú khi dán từ nơi khác. */
function isAllowedXmlChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0x20 || code === 0x09 || code === 0x0a || code === 0x0d;
}

export function escapeXml(value: string): string {
  return Array.from(value)
    .filter(isAllowedXmlChar)
    .join('')
    .replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);
}
