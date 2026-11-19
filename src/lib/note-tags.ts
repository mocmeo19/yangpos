const NOTE_SEPARATOR = ', ';

function splitNote(note: string): string[] {
  return note
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function isSameTag(left: string, right: string): boolean {
  return left.toLocaleLowerCase('vi') === right.toLocaleLowerCase('vi');
}

export function hasNoteTag(note: string, tag: string): boolean {
  return splitNote(note).some((part) => isSameTag(part, tag));
}

/** Bật/tắt một ghi chú nhanh (vd "Ít cay") trong ghi chú, giữ nguyên phần người dùng tự gõ. */
export function toggleNoteTag(note: string, tag: string): string {
  const parts = splitNote(note);
  const nextParts = hasNoteTag(note, tag)
    ? parts.filter((part) => !isSameTag(part, tag))
    : [...parts, tag];
  return nextParts.join(NOTE_SEPARATOR);
}
