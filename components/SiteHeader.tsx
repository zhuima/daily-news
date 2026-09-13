import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { SiteNav } from "@/components/SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-md">
      <div className="editorial-container flex h-14 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link
          href="/"
          className="group focus-ring flex min-w-0 flex-1 items-center gap-3 md:flex-none md:gap-4"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-marrs text-sm font-semibold text-white md:h-10 md:w-10"
            style={{ borderRadius: "var(--radius-inner)" }}
            aria-hidden
          >
            赛
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[1.05rem] font-semibold tracking-tight text-ink transition-colors duration-[240ms] group-hover:text-marrs md:text-lg">
              赛道扫描
            </span>
            <span className="hidden text-[12px] font-medium tracking-wide text-muted md:block">
              微信读书扫描归档
            </span>
          </span>
        </Link>
        <SiteNav />
        <MobileNav />
      </div>
    </header>
  );
}
