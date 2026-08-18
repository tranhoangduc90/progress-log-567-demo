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

test("server-renders the Progress Log demo", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Progress Log 567 · Demo<\/title>/i);
  assert.match(html, /Phiếu học tập &amp; xác nhận tham gia/);
  assert.match(html, /Hoàn thành đủ để tự xác nhận tham gia/);
  assert.match(html, /DỮ LIỆU GIẢ LẬP/);
  assert.doesNotMatch(html, /react-loading-skeleton|Building your site/);
});

test("keeps the agreed product guardrails in source", async () => {
  const [page, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Cần giảng viên xác nhận/);
  assert.match(page, /Không tự đánh vắng/);
  assert.match(page, /PHÂN TÍCH TỪ HỆ THỐNG/);
  assert.match(page, /TIN NHẮN CỦA CÔ LAN · VIẾT TRỰC TIẾP/);
  assert.match(page, /Không biến phần phân tích của AI thành lời của giảng viên/);
  assert.match(page, /một câu thật, 5–20 từ/);
  assert.match(page, /Array\.from\(\{ length: 30 \}/);
  assert.match(page, /miniCount/);
  assert.match(page, /Thư viện câu hỏi reflection phù hợp/);
  assert.match(page, /BASELINE CHỈ GỒM REFLECTION/);
  assert.match(page, /Một link dùng cả buổi, học viên chỉ nộp một lần cuối giờ/);
  assert.doesNotMatch(page, /Nội dung chính của từng phần/);
  assert.doesNotMatch(page, /Câu hỏi tùy biến của giảng viên/);
  assert.doesNotMatch(page, /Handout\/chấm tự động nâng cao/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
