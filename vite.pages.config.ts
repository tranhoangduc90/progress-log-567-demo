import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dùng đường dẫn tương đối để bản dựng chạy được dưới mọi tên repository
// GitHub Pages, không cần sửa lại base URL khi đổi tên repo.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "pages-dist",
    emptyOutDir: true,
  },
});
