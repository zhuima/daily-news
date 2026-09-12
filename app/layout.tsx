import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Serif_4, Geist } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans-stack",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-display-stack",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-stack",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "赛道扫描 · daily-news",
    template: "%s · 赛道扫描",
  },
  description:
    "从微信读书等来源扫描赛道动态，按日期归档阅读。云原生训推、算力成本、模型测评。",
};

export const viewport: Viewport = {
  themeColor: "#01847E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geist.variable} ${newsreader.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
