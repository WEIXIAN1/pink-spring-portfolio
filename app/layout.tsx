import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "张嘉慧 · AI Product & Creative Technology",
  description: "张嘉慧的电影感双语作品集：AI 产品、创意技术、AIGC 原型与脑机接口研究。",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
