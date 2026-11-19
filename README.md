# YangPOS

Ứng dụng POS quản lý đặt món cho quán ăn, xây bằng Next.js 16 + Tailwind CSS v4. Toàn bộ dữ liệu
(thực đơn, bàn, đơn hàng, đặt bàn, nhân viên, hóa đơn điện tử, sổ quỹ, cài đặt) lưu trong MongoDB
trên máy chủ; trình duyệt đọc và ghi qua REST API (`src/app/api`), nên nhiều máy dùng chung một
dữ liệu.

## Chạy dự án

Tạo file `.env.local` từ `.env.example`, điền khóa ký phiên đăng nhập và địa chỉ MongoDB:

```bash
cp .env.example .env.local
# Điền AUTH_SECRET bằng: openssl rand -base64 32
```

MongoDB chạy bằng Docker ở chế độ độc lập (không replica set), cổng 27019 để không đụng MongoDB
khác trên máy. Không có transaction nên các ràng buộc giữa nhiều máy được giữ bằng chỉ mục duy
nhất (mỗi bàn một đơn đang mở, mỗi thẻ rung một đơn, mỗi đơn một hóa đơn) và cập nhật có điều
kiện (đơn chỉ được thu tiền một lần):

```bash
docker compose up -d
```

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm run lint
npm run format   # Prettier + sắp xếp class Tailwind
```

Lần đầu kết nối, máy chủ tự tạo chỉ mục và dữ liệu mẫu (18 món, 4 danh mục, 8 bàn, 5 vai trò và
tài khoản Chủ cửa hàng với PIN `0000`, nên đổi ngay trong mục Nhân viên).

Đăng nhập tài khoản cửa hàng xong, từng nhân viên mở khóa máy bằng PIN riêng. PIN được kiểm tra
trên máy chủ (sai 5 lần tạm khóa 30 giây) và mọi API ghi dữ liệu đều kiểm tra quyền theo vai trò.
Các màn hình cần thấy thay đổi từ máy khác (bếp, bàn, đặt bàn) tự tải lại sau vài giây.

## Chức năng

- **Đăng nhập** (`/login`): tài khoản dùng thử `demo` / `demo`, hoặc bấm "Dùng thử với tài khoản
  demo". Phiên đăng nhập là cookie `httpOnly` có chữ ký HMAC, hết hạn sau 7 ngày; `src/proxy.ts`
  chuyển mọi trang khác về `/login` khi chưa đăng nhập và quay lại đúng trang sau khi đăng nhập.
- **Bán hàng** (`/`): thực đơn có ảnh, tìm món không cần gõ dấu hoặc theo mã vạch, chọn "Tại bàn /
  Mang đi" và chọn bàn trên sơ đồ, ghi chú nhanh từng món ("Ít cay", "Không hành"…), quét mã vạch để
  thêm món, gửi bếp hoặc thanh toán ngay. Phiếu đang gọi được giữ khi chuyển sang trang khác; trên
  điện thoại phiếu mở dạng bottom sheet.
- **Thanh toán**: tiền mặt (bàn phím số trên màn hình, gõ được cả bàn phím thật, gợi ý mệnh giá,
  tính tiền thừa, tự mở két), chuyển khoản (mã VietQR có sẵn số tiền và nội dung), thẻ (hướng dẫn
  dùng máy POS, ghi loại thẻ, 4 số cuối, mã chuẩn chi). In phiếu tạm tính ngay trong hộp thoại; có
  thể tự in hóa đơn sau khi thu tiền. Khi bật hóa đơn điện tử, nhập thông tin người mua (doanh
  nghiệp hoặc cá nhân) nếu khách yêu cầu xuất hóa đơn.
- **Đơn hàng** (`/orders`): phiếu bếp theo trạng thái (chờ chế biến → đang chế biến → đã phục vụ),
  thời gian chờ đổi màu sau 15 và 30 phút, in tạm tính, gọi thêm món, hủy đơn; lịch sử đơn kèm chi
  tiết thanh toán, hóa đơn điện tử và in lại hóa đơn.
- **Thẻ rung tự phục vụ**: bán mang đi thì chọn số thẻ rung đưa khách (thẻ đang trong tay khách
  khác bị khóa), số thẻ in to trên hóa đơn. Đơn có thẻ thu tiền trước vẫn ở màn bếp. Bếp bấm "Xong,
  gọi thẻ" thì ứng dụng nhắc nhân viên bấm số trên đế phát (cách dùng với Retekess TD157), hoặc gửi
  lệnh qua USB/COM với đế có cổng kết nối. Khách tới lấy món thì bấm "Khách đã nhận" để đóng đơn và
  trả thẻ.
- **Bàn** (`/tables`): lọc bàn trống/có khách, bấm "Gọi món" để sang Bán hàng với bàn đã chọn sẵn,
  thanh toán hoặc in tạm tính ngay trên thẻ bàn, thêm/sửa/xóa bàn.
- **Thực đơn** (`/menu`): quản lý danh mục và món, mã vạch/SKU cho từng món (không trùng nhau), đơn
  vị tính và thuế suất GTGT riêng (vd bia 10%), lọc đang bán/hết món, bật tắt nhanh, form có xem
  trước thẻ món.
- **Báo cáo** (`/reports`): hôm nay, hôm qua, 7 ngày, 30 ngày hoặc một ngày bất kỳ; chỉ số so với kỳ
  trước; biểu đồ doanh thu theo giờ/ngày (có dạng bảng); món bán chạy; tỷ trọng hình thức thanh toán.
- **Tài chính** (`/finance`), xem theo hôm nay, tháng này, tháng trước hoặc khoảng ngày bất kỳ:
  - _Tổng quan_: doanh thu, thuế GTGT đầu ra, chi phí theo khoản mục và lợi nhuận.
  - _Sổ quỹ_: tiền mặt và tiền gửi ngân hàng (tiền mặt bán hàng vào quỹ tiền mặt, chuyển khoản và
    thẻ vào ngân hàng), tồn đầu kỳ/cuối kỳ, lập phiếu thu (PT) và phiếu chi (PC) đánh số tự động,
    xuất Excel.
  - _Hóa đơn_: danh sách hóa đơn điện tử, xem chi tiết, in lại, gửi lại, lập bù cho đơn đã thu tiền
    chưa có hóa đơn, xuất bảng kê Excel theo từng thuế suất.
- **Cài đặt** (`/settings`): danh sách các mục theo nhóm kèm trạng thái, mỗi mục là một trang con:
  cửa hàng (`/settings/store`, xem trước phiếu in), hóa đơn điện tử (`/settings/einvoice`, xem trước
  và in thử), chuyển khoản (`/settings/bank-transfer`, quét thử mã VietQR mẫu), thanh toán thẻ
  (`/settings/card-payment`), máy in (`/settings/printer`, in thử), két tiền
  (`/settings/cash-drawer`), thẻ rung (`/settings/pager`, gọi thử) và máy quét mã
  (`/settings/scanner`, quét thử). Trên máy tính có menu bên trái để chuyển nhanh giữa các mục. Mỗi
  mục lưu riêng, báo "Chưa lưu" và cho hoàn tác.

Phím tắt: `/` để tìm món (Bán hàng, Thực đơn), `Esc` để đóng hộp thoại. Trên điện thoại, thanh dưới
có 4 mục chính và nút "Thêm" mở Báo cáo, Tài chính, Cài đặt.

## Hóa đơn điện tử (Nghị định 70/2025/NĐ-CP)

Quán ăn thuộc diện dùng **hóa đơn điện tử khởi tạo từ máy tính tiền**. Khi bật trong Cài đặt, mỗi
lần thanh toán ứng dụng lập một hóa đơn (hoặc chỉ khi khách nhập thông tin người mua, nếu tắt tự
động lập) rồi in kèm hóa đơn thanh toán. Mục "Phát hành qua" chọn nơi cấp số hóa đơn:

- **Thử nghiệm**: số và mã cấp ngay trên máy, không gửi đi đâu, bản in ghi "chưa có giá trị pháp
  lý".
- **MISA meInvoice**: phát hành qua API tích hợp của MISA (hóa đơn máy tính tiền, không cần chữ ký
  số); số hóa đơn, mã của cơ quan thuế và mã tra cứu do MISA cấp. Xem mục kết nối bên dưới.

Nội dung hóa đơn:

- Ký hiệu mẫu số `1` (hóa đơn GTGT) hoặc `2` (hóa đơn bán hàng), ký hiệu hóa đơn dạng `C26MAA`. Ở
  chế độ thử nghiệm, số hóa đơn tăng liên tục theo từng ký hiệu, cấp trong cùng giao dịch với việc
  lưu nên không trùng, không nhảy số.
- Mã của cơ quan thuế 23 ký tự `M1-26-XXXXX-ZZZZZZZZZZZ`. Ở chế độ thử nghiệm: 5 ký tự `XXXXX` do
  cơ quan thuế cấp khi đăng ký, 11 số cuối gồm số hiệu máy (2 số) và số thứ tự (9 số) để nhiều máy
  bán hàng không trùng mã. Mỗi máy nên dùng ký hiệu và số hiệu máy riêng. Với MISA, mã do MISA
  sinh.
- Giá bán đã gồm thuế; thuế được tách theo từng thuế suất, làm tròn trên tổng mỗi thuế suất để tổng
  tiền luôn khớp. Thuế suất mặc định 8% (dịch vụ ăn uống được giảm đến hết 31/12/2026 theo Nghị
  định 174/2025/NĐ-CP); món như bia, rượu đặt riêng 10% trong Thực đơn.
- Thông tin người mua chỉ ghi khi khách yêu cầu: tên, mã số thuế hoặc số định danh, địa chỉ, điện
  thoại, email.
- Bản in có tên hóa đơn, "(Khởi tạo từ máy tính tiền)", ký hiệu, số, ngày lập, người bán, người
  mua, đơn vị tính, tiền thuế theo thuế suất, số tiền bằng chữ, mã của cơ quan thuế, mã tra cứu
  (khi nhà cung cấp cấp) và trang tra cứu (`hoadondientu.gdt.gov.vn`, hoặc `meinvoice.vn/tra-cuu`
  khi dùng MISA).

### Kết nối MISA meInvoice

1. Chuẩn bị với MISA: tài khoản meInvoice có tờ khai dùng hóa đơn khởi tạo từ máy tính tiền đã được
   cơ quan thuế chấp nhận, ký hiệu máy tính tiền của năm (vd `1C26MAA`) và **AppID** tích hợp do
   MISA cấp.
2. Thêm vào `.env.local` của máy chủ rồi khởi động lại ứng dụng:

   ```bash
   MISA_MEINVOICE_APP_ID=appid-do-misa-cap
   MISA_MEINVOICE_TAX_CODE=0101234567
   MISA_MEINVOICE_USERNAME=tai-khoan-meinvoice
   MISA_MEINVOICE_PASSWORD=mat-khau
   MISA_MEINVOICE_ENVIRONMENT=test   # đổi thành production khi dùng thật
   ```

   Tài khoản chỉ nằm trên máy chủ. Trình duyệt gọi qua Server Action
   (`src/actions/misa-einvoice-actions.ts`), và Server Action chỉ nhận phiên đã đăng nhập.
   `MISA_MEINVOICE_API_URL` (không bắt buộc) dùng để trỏ tới máy chủ giả lập khi kiểm thử.

3. Vào Cài đặt → Hóa đơn điện tử, chọn "Phát hành qua: MISA meInvoice" rồi bấm "Kiểm tra kết nối".
   Chọn ký hiệu trong danh sách MISA trả về, rồi lưu. Quán bán cả món 8% và bia 10% thì chọn mẫu
   nhiều thuế suất.

Khi thanh toán:

- Ứng dụng lưu hóa đơn trước (mã hóa đơn trong máy chính là RefID gửi MISA), gửi MISA rồi mới in.
  Nhờ vậy bản in có số, mã của cơ quan thuế và mã tra cứu chính thức. Người mua để lại email thì
  MISA gửi hóa đơn cho họ.
- Mất mạng hoặc MISA báo lỗi thì tiền vẫn được ghi nhận và phiếu in như phiếu thanh toán thường.
  Hóa đơn nằm ở Tài chính → Hóa đơn với trạng thái "Gửi lỗi", bấm "Phát hành lại" để gửi lần nữa.
  MISA dựa vào RefID nên gửi lại không sinh hóa đơn trùng.

**Cần chạy thử trên môi trường thử nghiệm của MISA (`MISA_MEINVOICE_ENVIRONMENT=test`) trước khi
dùng thật.** Phần kết nối viết theo tài liệu API tích hợp công khai tại
[doc.meinvoice.vn/itg](https://doc.meinvoice.vn/itg/intro.html) và đã chạy với máy chủ giả lập, chưa
chạy với tài khoản MISA thật. Nên đối chiếu với MISA các điểm sau:

- Đơn giá chưa thuế được gửi với 2 số lẻ, kèm đơn giá và thành tiền sau thuế. Tiền thuế từng dòng
  và từng thuế suất lấy đúng như trên bản in.
- Hóa đơn bán hàng (mẫu số 2) gửi không kèm thuế suất.
- Số định danh cá nhân của người mua gửi vào trường "Số CMT/CCCD" (`AccountObjectIdentificationNumber`).

**Giới hạn hiện tại**:

- Chỉ có hai lựa chọn: thử nghiệm và MISA meInvoice. Nhà cung cấp khác (Viettel, VNPT…) thêm bằng
  một `EInvoiceProvider` trong `src/lib/einvoice/providers/`.
- Chưa có hóa đơn điều chỉnh/thay thế, chưa tự ghi chú giảm thuế cho hộ kinh doanh dùng hóa đơn bán
  hàng.
- Sổ quỹ và lãi lỗ dùng để theo dõi kinh doanh theo dòng tiền, không thay cho sổ kế toán theo quy
  định.

## Thiết bị

| Thiết bị | Cách kết nối | Ghi chú |
| --- | --- | --- |
| Máy in hóa đơn | **Qua trình duyệt**: mọi máy in đã cài trên máy (USB, Bluetooth, AirPrint). **Máy in mạng LAN**: gửi lệnh ESC/POS thẳng tới cổng 9100. | Chế độ trình duyệt hiện hộp thoại in; muốn in thẳng, mở Chrome với `--kiosk-printing`. Chế độ LAN in hóa đơn dạng ảnh nên tiếng Việt có dấu đúng trên mọi máy in nhiệt (khổ 80 mm hoặc 58 mm). |
| Két tiền | Cắm dây RJ11 vào cổng DK của máy in hóa đơn. | Ứng dụng mở két bằng lệnh gửi qua máy in mạng LAN. Với máy in USB, bật tùy chọn mở két trong driver máy in. |
| Máy quẹt thẻ Visa/Mastercard | Máy POS của ngân hàng chạy độc lập. | Ứng dụng hiện số tiền cần bấm trên máy POS và lưu loại thẻ, 4 số cuối, mã chuẩn chi; không bao giờ lưu số thẻ đầy đủ. Kết nối tự động (ECR) cần bộ giao thức riêng của ngân hàng cấp máy. |
| Máy quét mã vạch | USB hoặc Bluetooth ở chế độ bàn phím (HID). | Nhận diện mã dựa trên tốc độ gõ và phím kết thúc (Enter/Tab), không cần cài phần mềm. |
| Bộ thẻ rung tự phục vụ | **Retekess TD157**: đế phát chỉ có bàn phím và khe sạc, không có cổng nối máy tính, nên ứng dụng hiện số thẻ để nhân viên bấm số rồi CALL trên đế. **Bộ khác**: bấm trên đế phát, hoặc USB/COM nếu đế có cổng USB/RS232. | TD157: ghép số thẻ 001–998 trên đế (Cài đặt → Thẻ rung có hướng dẫn ghép số, chỉnh thời gian rung); ứng dụng không cấp số 99 vì đế đời đầu coi 99 là lệnh tắt, còn 999 + CALL tắt mọi thẻ. Retekess chỉ ghi các dòng TD156, TD103, TD159 là nối được POS. Chế độ USB/COM dùng Web Serial (Chrome/Edge trên máy tính, trang chạy qua HTTPS hoặc localhost); mẫu lệnh gọi thẻ lấy theo tài liệu kết nối POS của hãng, có xem trước byte và gọi thử. |
| Chuyển khoản | Mã VietQR theo chuẩn Napas. | Nội dung chuyển khoản gồm tiền tố và số đơn (vd `YANGPOS 0007`) để đối chiếu. |

In qua mạng LAN đi qua Server Action (`src/actions/printer-actions.ts`), nên máy chủ Next.js phải
chạy trong cùng mạng với máy in (ví dụ chạy `npm start` trên máy tính tại quầy). Server chỉ nhận
yêu cầu từ phiên đã đăng nhập và chỉ gửi tới địa chỉ IPv4 nội bộ (10.x, 172.16–31.x, 192.168.x)
trên cổng 9100–9109.

## Cấu trúc

```
src/
  app/            Route: login/ và nhóm (pos)/ chứa các màn hình POS
  actions/        Server Actions (đăng nhập, đăng xuất, gửi lệnh tới máy in mạng, phát hành hóa
                  đơn và kiểm tra kết nối MISA)
  proxy.ts        Chặn truy cập khi chưa đăng nhập
  components/
    ui/           Thành phần dùng chung: Button, Modal (bottom sheet trên điện thoại), DropdownMenu…
    feedback/     Toast và hộp xác nhận dùng chung
    layout/       Thanh điều hướng, menu "Thêm" trên điện thoại, menu người dùng
    payment/      Các phần của hộp thoại thanh toán: tiền mặt, chuyển khoản, thẻ, người mua
    einvoice/     Lập, xem, trạng thái gửi hóa đơn điện tử
    pager/        Chọn số thẻ rung
    finance/      Trang Tài chính: lãi lỗ, sổ quỹ, danh sách hóa đơn
    printing/     In qua trình duyệt và đầu mối in (chọn trình duyệt hay máy in mạng)
    receipt/      Hóa đơn dạng HTML (kể cả bản thể hiện hóa đơn điện tử) và mã QR
    settings/     Trang cài đặt và từng phần cài đặt
    pos/ orders/ tables/ menu/ reports/ auth/   Giao diện từng màn hình
  contexts/       React context: toast, hộp xác nhận, phiếu đang gọi, cài đặt, máy in, nhân viên
  app/api/        REST API (Route Handlers): kiểm tra phiên, quyền và dữ liệu gửi lên rồi gọi server/
  server/         Chỉ chạy trên máy chủ: db/ kết nối MongoDB, chỉ mục, dữ liệu mẫu;
                  repositories/ đọc/ghi MongoDB, cấp số liên tục cho đơn, hóa đơn, phiếu thu chi;
                  auth/ phiên nhân viên (cookie), kiểm tra PIN và quyền; api/ khung route, schema zod
  api-client/     Hàm gọi API phía trình duyệt, tự tải lại dữ liệu liên quan sau khi ghi
  hooks/          Đọc dữ liệu qua API (SWR), thanh toán, lập hóa đơn, in hóa đơn, máy quét mã…
  lib/            Hàm thuần: tính tiền, báo cáo, định dạng; einvoice/ ký hiệu, mã, tách thuế,
                  nhà cung cấp; misa/ dữ liệu và lời gọi API MISA meInvoice (phần gọi mạng chỉ
                  chạy trên máy chủ); finance/ sổ quỹ, lãi lỗ, bảng kê, số tiền bằng chữ; xlsx/ tạo tệp
                  Excel không cần thư viện; pager/ lệnh gọi thẻ rung qua Web Serial;
                  escpos/ dựng lệnh in ESC/POS; receipt/ dựng hóa đơn;
                  settings/ kiểm tra cài đặt; payment/ thanh toán; vietqr.ts mã VietQR
  types/          Kiểu dữ liệu dùng chung
```

Dữ liệu nằm trong MongoDB (volume Docker `mongo-data`); hãy sao lưu định kỳ, vd bằng
`docker exec yangpos-mongo-1 mongodump --archive > yangpos.archive`, và vẫn nên xuất Excel sổ quỹ,
bảng kê hóa đơn để lưu trữ.
