"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "扫描" },
  { href: "/accounts", label: "公众号" },
  { href: "/about", label: "关于" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:gap-2" aria-label="主导航">
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-sm px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-marrs/10 text-marrs"
                : "text-muted hover:bg-paper hover:text-marrs"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/#site-search"
        className="hidden rounded-sm px-3 py-2 text-sm text-muted transition-colors hover:text-marrs sm:inline"
      >
        搜索
      </Link>
    </nav>
  );
}
