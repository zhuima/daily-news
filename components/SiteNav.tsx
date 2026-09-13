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
    <nav className="hidden items-center gap-5 md:flex" aria-label="主导航">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`nav-link focus-ring ${active ? "nav-link-active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link href="/#site-search" className="nav-link focus-ring">
        搜索
      </Link>
    </nav>
  );
}
