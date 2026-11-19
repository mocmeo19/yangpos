/**
 * Đường xé của phiếu giấy. Hai vết khuyết hai bên phải trùng màu nền trang nên chỉ bật khi phiếu
 * nằm trực tiếp trên nền `canvas`.
 */
export function TicketDivider({ notched = true }: { notched?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-0 shrink-0 border-t border-dashed border-line-strong"
    >
      {notched && (
        <>
          <span className="absolute top-0 left-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-canvas [clip-path:inset(0_0_0_calc(50%-1px))]" />
          <span className="absolute top-0 right-0 size-4 translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-canvas [clip-path:inset(0_calc(50%-1px)_0_0)]" />
        </>
      )}
    </div>
  );
}
