import type { ReactNode } from 'react';
import { SettingsNote } from './SettingsNote';

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-line-strong bg-surface px-1.5 py-px font-mono text-[11px] font-semibold text-ink">
      {children}
    </kbd>
  );
}

/** Thao tác trên đế phát Retekess TD157, tóm từ hướng dẫn sử dụng của hãng. */
export function RetekessTd157Guide() {
  return (
    <SettingsNote title="Dùng với đế phát Retekess TD157">
      <ol className="mt-1.5 list-decimal space-y-1.5 pl-4">
        <li>
          <strong className="text-ink">Gọi khách:</strong> bếp bấm “Xong, gọi
          thẻ” thì ứng dụng hiện số thẻ; nhân viên bấm số đó rồi <Key>CALL</Key>{' '}
          trên đế. Đơn trả tiền trước vẫn ở màn bếp tới khi bấm “Khách đã nhận”.
          Khách trả thẻ thì cắm lại vào khe sạc để thẻ ngừng rung và sạc pin.
        </li>
        <li>
          <strong className="text-ink">Ghép số cho thẻ (F2):</strong> rút hết
          thẻ khỏi đế, bấm cùng lúc <Key>CALL</Key> và <Key>DEL</Key> (đế đời
          đầu ghi Clear) tới khi màn hình hiện F1, bấm <Key>2</Key>{' '}
          <Key>CALL</Key>, nhập số 3 chữ số (001–998) rồi cắm thẻ vào khe sạc;
          đèn trên thẻ nháy là xong. Ghép hết thẻ thì bấm <Key>DEL</Key> để
          thoát.
        </li>
        <li>
          <strong className="text-ink">
            Thời gian rung (F4), tiếng bíp (F3):
          </strong>{' '}
          vào F1 như trên, bấm <Key>4</Key> <Key>CALL</Key> rồi nhập 001–099
          giây, hoặc <Key>3</Key> <Key>CALL</Key> rồi nhập 001 (bật) hay 000
          (tắt), bấm <Key>CALL</Key> để lưu. Đổi F1, F3, F4 xong phải ghép lại
          thẻ.
        </li>
        <li>
          <strong className="text-ink">Không bấm 999 rồi CALL</strong> lúc đang
          bán: đó là lệnh tắt mọi thẻ. Đế đời đầu còn coi 99 là lệnh tắt nên ứng
          dụng không cấp thẻ số 99.
        </li>
      </ol>
    </SettingsNote>
  );
}
