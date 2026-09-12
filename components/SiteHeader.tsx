import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { SiteNav } from "@/components/SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-md">
      <div className="editorial-container flex h-14 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-center gap-3 md:gap-4 md:flex-none"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-marrs text-sm font-semibold text-white md:h-10 md:w-10"
            aria-hidden
          >
            赛
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[1.05rem] font-semibold tracking-tight text-ink group-hover:text-marrs md:text-lg">
              赛道扫描
            </span>
            <span className="hidden font-display text-[11px] tracking-[0.2em] text-muted uppercase md:block">
              WeRead Track Archive
            </span>
          </span>
        </Link>
        <SiteNav />
        <MobileNav />
      </div>
    </header>
  );
}
