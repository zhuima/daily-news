import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { SiteNav } from "@/components/SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="docs-container flex h-14 items-center justify-between gap-6">
        <Link
          href="/"
          className="group focus-ring flex min-w-0 items-center gap-2.5"
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center bg-marrs text-[11px] font-semibold text-white"
            style={{ borderRadius: "0.25rem" }}
            aria-hidden
          >
            赛
          </span>
          <span className="truncate text-[15px] font-medium tracking-tight text-ink group-hover:text-marrs">
            赛道扫描
          </span>
        </Link>
        <SiteNav />
        <MobileNav />
      </div>
    </header>
  );
}
