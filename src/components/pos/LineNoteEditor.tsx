'use client';

import { Check } from 'lucide-react';
import { NOTE_SUGGESTIONS } from '@/data/note-suggestions';
import { cn } from '@/lib/cn';
import { hasNoteTag, toggleNoteTag } from '@/lib/note-tags';

interface LineNoteEditorProps {
  itemName: string;
  note: string;
  onChange: (note: string) => void;
  onDone: () => void;
}

export function LineNoteEditor({
  itemName,
  note,
  onChange,
  onDone,
}: LineNoteEditorProps) {
  return (
    <div className="mt-2 flex flex-col gap-2 rounded-xl bg-surface-muted p-2.5">
      <div
        role="group"
        aria-label="Ghi chú nhanh"
        className="flex flex-wrap gap-1.5"
      >
        {NOTE_SUGGESTIONS.map((tag) => {
          const isActive = hasNoteTag(note, tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(toggleNoteTag(note, tag))}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-brand bg-brand-soft text-brand-dark'
                  : 'border-line bg-surface text-ink-soft hover:text-ink',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          autoFocus
          value={note}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onDone();
            }
          }}
          placeholder="Ghi chú khác cho bếp…"
          aria-label={`Ghi chú cho ${itemName}`}
          className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <button
          type="button"
          onClick={onDone}
          aria-label="Xong ghi chú"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink text-white transition-colors hover:bg-ink/85"
        >
          <Check className="size-4" />
        </button>
      </div>
    </div>
  );
}
