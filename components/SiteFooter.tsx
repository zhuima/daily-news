import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="editorial-container grid gap-10 py-12 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
            Track Scan
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            微信读书关键词扫描的静态归档站。按日期、检索词、公众号浏览；深链阅读；直链原文；面向人与检索引擎的可读结构。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs tracking-wide text-marrs">浏览</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <Link href="/" className="hover:text-marrs">
                  扫描归档
                </Link>
              </li>
              <li>
                <Link href="/accounts" className="hover:text-marrs">
                  追踪公众号
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-marrs">
                  数据说明
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-wide text-marrs">机器可读</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <a href="/sitemap.xml" className="hover:text-marrs">
                  sitemap.xml
                </a>
              </li>
              <li>
                <a href="/robots.txt" className="hover:text-marrs">
                  robots.txt
                </a>
              </li>
              <li>
                <Link href="/llms.txt" className="hover:text-marrs">
                  llms.txt
                </Link>
              </li>
              <li>
                <a href="/feed.xml" className="hover:text-marrs">
                  feed.xml
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="editorial-container flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>赛道扫描 · daily-news · 静态归档</p>
          <p className="break-all">{absoluteUrl("/")}</p>
        </div>
      </div>
    </footer>
  );
}
