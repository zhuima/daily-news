import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/90 bg-canvas/90 backdrop-blur-md">
      <div className="editorial-container flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" className="group flex min-w-0 items-center gap-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-marrs/30 bg-marrs text-sm font-semibold text-white"
            aria-hidden
          >
            赛
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-medium tracking-tight text-ink group-hover:text-marrs">
              赛道扫描
            </span>
            <span className="block truncate font-display text-[10px] tracking-[0.24em] text-muted uppercase">
              WeRead Track Archive
            </span>
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
