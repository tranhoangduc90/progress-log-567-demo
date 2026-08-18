# Progress Log 567 · Demo

Bản minh họa tương tác cho cuộc thi Progress Log. Toàn bộ tên, lớp, điểm số và lịch sử trong demo là dữ liệu giả.

## Người xem có thể thử

- Học viên: mở một link, Entry Ticket, hai mini-reflection, Exit Ticket, xác nhận tham gia và tóm tắt sau buổi.
- Giảng viên: xem ngoại lệ của lớp, chọn hành động thật và tạo phiếu với 1–3 mini-reflection.
- Toàn khóa: xem bản đồ 30 buổi, kỹ năng, BTVN và lỗi sai theo thời gian.

## Giới hạn có chủ ý

- Không kết nối portal điểm danh, database, BTVN hoặc bài test thật.
- Không lưu dữ liệu sau khi tải lại trang.
- Không dùng dữ liệu định danh học viên.
- Trường hợp nộp thiếu chỉ chuyển sang “Cần giảng viên xác nhận”, không tự đánh vắng.

## Chạy và kiểm tra

- `npm run dev`: mở bản demo cục bộ.
- `npm run build`: kiểm tra bản dựng.
- `npm run lint`: kiểm tra mã nguồn.
- `npm test`: dựng ứng dụng và xác nhận các nguyên tắc sản phẩm cốt lõi vẫn có trong bản phát hành.

Ứng dụng nhận dữ liệu giả được viết sẵn trong trang, xử lý hoàn toàn trên trình duyệt và chỉ thay đổi màn hình người xem. Nếu có lỗi dựng, người dùng sẽ không mở được trang; lệnh kiểm tra trả về thông báo lỗi thay vì ghi dữ liệu ra hệ thống bên ngoài.
