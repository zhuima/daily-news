"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const nav = [
  { href: "/", label: "扫描归档" },
  { href: "/accounts", label: "追踪公众号" },
  { href: "/about", label: "关于与数据" },
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
        className="flex h-11 w-11 items-center justify-center rounded-sm text-ink ring-1 ring-line transition-colors hover:bg-paper hover:text-marrs"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "关闭" : "菜单"}</span>
        <svg
          aria-hidden
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <path d="M6 6l12 12M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px]"
          aria-label="关闭菜单"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="站点导航"
        className={`fixed inset-x-0 top-[3.5rem] z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-line bg-canvas shadow-lg transition duration-200 ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="editorial-container flex flex-col gap-1 py-4">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-4 py-3.5 text-base transition-colors ${
                  active
                    ? "bg-marrs text-white"
                    : "text-ink hover:bg-paper hover:text-marrs"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/#site-search"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-sm border border-line bg-paper px-4 py-3.5 text-base text-ink hover:border-marrs/40 hover:text-marrs"
          >
            全站搜索
          </Link>
        </nav>
      </div>
    </div>
  );
}
