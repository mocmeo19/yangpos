import { LoaderCircle } from 'lucide-react';

export function LoadingState({
  label = 'Đang tải dữ liệu…',
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-20 text-ink-soft"
    >
      <LoaderCircle className="size-6 animate-spin text-brand" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
