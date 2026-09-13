"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "扫描" },
  { href: "/accounts", label: "公众号" },
  { href: "/about", label: "关于" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-0.5 md:flex" aria-label="主导航">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`interactive focus-ring px-3.5 py-2 text-sm font-medium ${
              active
                ? "bg-marrs text-white"
                : "text-muted hover:bg-paper hover:text-marrs"
            }`}
            style={{ borderRadius: "var(--radius-inner)" }}
          >
            {item.label}
          </Link>
        );
      })}
      <span className="mx-2 h-4 w-px bg-line" aria-hidden />
      <Link
        href="/#site-search"
        className="interactive focus-ring px-3.5 py-2 text-sm text-muted hover:text-marrs"
        style={{ borderRadius: "var(--radius-inner)" }}
      >
        搜索
      </Link>
    </nav>
  );
}
