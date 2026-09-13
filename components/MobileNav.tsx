"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const nav = [
  { href: "/", label: "扫描" },
  { href: "/accounts", label: "公众号" },
  { href: "/about", label: "关于" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="focus-ring relative z-50 flex h-9 w-9 items-center justify-center text-ink hover:text-marrs"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "关闭" : "菜单"}</span>
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-x-0 top-14 bottom-0 z-40 bg-ink/20"
          aria-label="关闭菜单"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="站点导航"
        className={`fixed inset-x-0 top-14 z-50 border-b border-line bg-paper ${
          open ? "" : "pointer-events-none hidden"
        }`}
      >
        <nav className="docs-container flex flex-col py-3">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`focus-ring py-2.5 text-[15px] ${
                  active ? "text-marrs" : "text-ink hover:text-marrs"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/#site-search"
            onClick={() => setOpen(false)}
            className="focus-ring py-2.5 text-[15px] text-ink hover:text-marrs"
          >
            搜索
          </Link>
        </nav>
      </div>
    </div>
  );
}
