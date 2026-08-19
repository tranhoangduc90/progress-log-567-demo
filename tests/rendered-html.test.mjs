import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the simplified Progress Log demo", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Progress Log 567 · Demo<\/title>/i);
  assert.match(html, /Phiếu học tập &amp; xác nhận tham gia/);
  assert.match(html, /Điền đủ \+ Nộp = xác nhận tham gia/);
  assert.match(html, /DỮ LIỆU GIẢ LẬP/);
});

test("keeps adoption, autonomy and safety guardrails in source", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /Giảng viên quyết định có bao nhiêu điểm dừng và mở chúng lúc nào/);
  assert.match(page, /3 việc cần bạn quyết định/);
  assert.match(page, /11 học viên còn lại/);
  assert.match(page, /PHÂN TÍCH TỪ HỆ THỐNG/);
  assert.match(page, /LỜI NHẮN CÔ LAN · VIẾT TRỰC TIẾP/);
  assert.match(page, /AI không viết lại câu này/);
  assert.match(page, /Không tự đánh vắng/);
  assert.match(page, /Array\.from\(\{ length: 30 \}/);
  assert.match(page, /reflectionLibrary/);
  assert.doesNotMatch(page, /7 phút cuối/i);
  assert.doesNotMatch(page, /ENTRY TICKET|EXIT TICKET/);
});
