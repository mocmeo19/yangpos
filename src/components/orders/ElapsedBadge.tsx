import { Clock3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  formatElapsed,
  getElapsedMinutes,
  getElapsedTone,
  type ElapsedTone,
} from '@/lib/elapsed-time';
import { formatTime } from '@/lib/format-time';

const TONE_CLASSES: Record<ElapsedTone, string> = {
  normal: 'bg-ink/5 text-ink-soft',
  warning: 'bg-warning-soft text-warning',
  late: 'bg-danger-soft text-danger',
};

interface ElapsedBadgeProps {
  since: number;
  now: number;
}

export function ElapsedBadge({ since, now }: ElapsedBadgeProps) {
  const minutes = getElapsedMinutes(since, now);

  return (
    <span
      title={`Tạo lúc ${formatTime(since)}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap tabular-nums',
        TONE_CLASSES[getElapsedTone(minutes)],
      )}
    >
      <Clock3 aria-hidden="true" className="size-3.5" />
      {formatElapsed(minutes)}
    </span>
  );
}
