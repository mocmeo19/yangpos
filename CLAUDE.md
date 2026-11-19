# Quy tắc phát triển

Áp dụng cho toàn bộ dự án. Làm việc với tư duy của một senior Node.js developer: ưu tiên code rõ
ràng, dễ bảo trì và phù hợp với kiến trúc hiện có.

## Thiết kế và SOLID

- Tuân thủ các nguyên tắc SOLID khi thiết kế và thay đổi code.
- Single Responsibility: mỗi module, class hoặc function có một trách nhiệm rõ ràng.
- Mỗi file chỉ hiện thực một chức năng. Khi file bắt đầu gánh thêm chức năng khác (ví dụ vừa tải dữ
  liệu vừa hiển thị tiến độ), tách phần đó ra file riêng; type dùng chung đặt trong file type riêng.
- Open/Closed: thiết kế điểm mở rộng phù hợp để thêm hành vi mà hạn chế sửa logic ổn định.
- Liskov Substitution: implementation thay thế phải giữ đúng hợp đồng và hành vi mong đợi.
- Interface Segregation: chia interface theo nhu cầu sử dụng, tránh buộc module phụ thuộc vào chức
  năng không cần thiết.
- Dependency Inversion: tách logic nghiệp vụ khỏi chi tiết hạ tầng; truyền dependency qua tham số
  hoặc constructor khi cần.
- Áp dụng SOLID thực tế, tránh tạo abstraction, interface hoặc class không mang lại lợi ích rõ ràng.

## Node.js và TypeScript

- Tuân theo cấu trúc thư mục, cách đặt tên và hệ module của dự án.
- Ưu tiên API bất đồng bộ cho I/O; dùng stream khi xử lý dữ liệu lớn.
- Xử lý lỗi rõ ràng, giữ thông tin lỗi gốc và giải phóng tài nguyên khi thất bại hoặc bị hủy.
- Khai báo type rõ ràng ở API công khai; hạn chế `any` và ép kiểu thiếu kiểm chứng.
- Giữ thay đổi đúng phạm vi yêu cầu và kiểm tra hành vi bị ảnh hưởng trước khi hoàn tất.

## Comment

- Không lạm dụng comment. Ưu tiên tên biến, tên hàm và cấu trúc code dễ hiểu.
- Chỉ thêm comment để giải thích lý do, ràng buộc hoặc quyết định khó suy ra từ code.
- Không viết comment chỉ để diễn giải lại code hoặc mô tả thao tác hiển nhiên.
- Chỉ dùng JSDoc khi hợp đồng API hoặc hành vi cần được làm rõ; không lặp lại thông tin đã thể hiện
  qua type.
- Khi sửa code, cập nhật hoặc xóa comment không còn chính xác.

## Điều kiện và tính dễ đọc

- Không dùng toán tử ba ngôi lồng nhau (`nested ternary`), kể cả trong JSX, phép gán, biểu thức trả
  về hoặc chuỗi class Tailwind.
- Toán tử ba ngôi chỉ dành cho một điều kiện đơn giản với hai kết quả ngắn, dễ hiểu. Khi biểu thức
  cần nhiều nhánh hoặc phải xuống nhiều dòng để theo dõi, dùng `if/else`, `switch` hoặc tách thành
  hàm có tên mô tả mục đích.
- Dùng `switch` khi phân nhánh theo các giá trị cụ thể của cùng một biến, ví dụ `event.key`. Dùng
  biến trung gian có tên rõ nghĩa cho phép tính hoặc điều kiện phức tạp.
- Không thay ternary lồng nhau bằng IIFE hoặc một chuỗi biểu thức khó đọc khác. Ưu tiên luồng xử lý
  rõ ràng, mỗi nhánh một trách nhiệm.
- Code mới và code được chỉnh sửa phải tuân theo các quy tắc này, đồng thời được định dạng bằng cấu
  hình Prettier của dự án.
