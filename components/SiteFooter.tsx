import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/", label: "扫描" },
  { href: "/accounts", label: "公众号" },
  { href: "/about", label: "关于" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/feed.xml", label: "RSS" },
  { href: "/sitemap.xml", label: "Sitemap" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="docs-container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-muted">
          © {year} {SITE_NAME}
          <span className="mx-2 text-line">·</span>
          静态归档，不实时抓取
        </p>
        <nav aria-label="页脚" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {links.map((item) =>
            item.href.startsWith("/") && !item.href.includes(".") ? (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring text-[13px] text-muted hover:text-marrs"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="focus-ring text-[13px] text-muted hover:text-marrs"
              >
                {item.label}
              </a>
            ),
          )}
          <a
            href="https://github.com/zhuima/daily-news"
            className="focus-ring text-[13px] text-muted hover:text-marrs"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
