const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/** Phím bấm đang đi vào ô nhập liệu nên không được xử lý như phím tắt hay mã quét. */
export function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || TYPING_TAGS.has(target.tagName))
  );
}
