import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const browse = [
  { href: "/", label: "扫描归档" },
  { href: "/#scans", label: "批次列表" },
  { href: "/accounts", label: "追踪公众号" },
  { href: "/about", label: "数据说明" },
] as const;

const machine = [
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/feed.xml", label: "RSS" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/robots.txt", label: "Robots" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-4 border-marrs bg-paper">
      <div className="editorial-container py-10 md:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-2xl font-semibold tracking-tight text-ink">
              {SITE_NAME}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              微信读书关键词扫描的静态归档。深链阅读、可验证原文、面向人与检索引擎的结构化页面。
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex text-sm font-medium text-marrs hover:underline"
            >
              了解数据从哪来 →
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
            <div>
              <h2 className="text-xs font-semibold tracking-[0.16em] text-marrs uppercase">
                浏览
              </h2>
              <ul className="mt-4 space-y-2.5">
                {browse.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink/80 transition-colors hover:text-marrs"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold tracking-[0.16em] text-marrs uppercase">
                机器可读
              </h2>
              <ul className="mt-4 space-y-2.5">
                {machine.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-ink/80 transition-colors hover:text-marrs"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-canvas/80">
        <div className="editorial-container flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME} · daily-news · 静态归档，不实时抓取
          </p>
          <a
            href="https://github.com/zhuima/daily-news"
            className="text-marrs hover:underline"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
