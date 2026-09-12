import Link from "next/link";

const nav = [
  { href: "/", label: "扫描" },
  { href: "/about", label: "关于" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="text-[1.35rem] font-medium tracking-tight text-marrs">
            赛道扫描
          </span>
          <span className="hidden font-display text-[0.7rem] tracking-[0.22em] text-muted uppercase sm:inline">
            Track Scan
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-sm text-muted">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-marrs"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
