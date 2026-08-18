import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../app/globals.css";
import Home from "../app/page";

// GitHub Pages chỉ phục vụ file tĩnh. Điểm vào này nhận nội dung demo
// đã viết sẵn, gắn vào phần tử #root và xử lý mọi thao tác ngay trên trình duyệt.
// Không có dữ liệu thật được gửi đi; nếu JavaScript lỗi, người xem chỉ thấy
// dòng “Đang mở bản demo…” trong index.html.
const root = document.getElementById("root");

if (!root) {
  throw new Error("Không tìm thấy vùng hiển thị #root.");
}

createRoot(root).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
