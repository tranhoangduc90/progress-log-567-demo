import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Progress Log 567 · Demo",
  description: "Prototype phiếu học tập và xác nhận tham gia cho khóa IELTS 5–6 và 6–7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
