# Progress Log 567 · Demo

Bản demo tương tác cho cuộc thi Progress Log. Toàn bộ tên, lớp, điểm số và lịch sử đều là dữ liệu giả.

## Hai trải nghiệm được minh họa

- Học viên mở một link, điền hai điểm dừng do giảng viên mở vào thời điểm phù hợp, nộp một lần và nhận ngay xác nhận tham gia cùng việc tiếp theo.
- Giảng viên chọn 1–3 điểm dừng, quyết định thời điểm mở, lấy câu hỏi từ thư viện và chỉ xử lý các ngoại lệ sau buổi học.
- Phân tích của hệ thống luôn có nhãn riêng; giảng viên tự viết một câu ngắn bằng giọng thật và AI không viết lại.

## Giới hạn có chủ ý

- Không kết nối portal điểm danh, database, BTVN hoặc bài test thật.
- Không lưu dữ liệu sau khi tải lại trang và không gửi dữ liệu ra ngoài.
- Phiếu baseline chỉ chứa câu hỏi reflection, không nhúng bài tập hoặc handout.
- Nộp thiếu chuyển sang giảng viên xác nhận; hệ thống không tự đánh vắng.

## Kiểm tra

- `npm run dev`: chạy bản demo cục bộ.
- `npm run build`: kiểm tra bản dựng server.
- `npm run build:pages`: tạo bản tĩnh cho GitHub Pages.
- `npm run lint`: kiểm tra mã nguồn.
- `npm test`: xác nhận các nguyên tắc sản phẩm cốt lõi.
