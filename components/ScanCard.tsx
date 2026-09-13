import Link from "next/link";
import type { Scan } from "@/lib/types";
import { formatScanDate, sourceLabel } from "@/lib/format";

export function ScanCard({
  scan,
  meta,
  featured = false,
}: {
  scan: Scan;
  meta?: { total: number; linked: number; queries: number };
  featured?: boolean;
}) {
  return (
    <Link
      href={`/scans/${scan.id}`}
      className={`interactive focus-ring group grid gap-6 sm:grid-cols-[7.5rem_1fr] ${
        featured
          ? "bg-paper p-8 sm:p-10"
          : "py-7"
      }`}
      style={featured ? { borderRadius: "var(--radius-outer)" } : undefined}
    >
      <div
        className={
          featured
            ? "border-l-2 border-marrs pl-4 sm:border-t-2 sm:border-l-0 sm:pt-4 sm:pl-0"
            : "sm:pt-1"
        }
      >
        <p className="text-[13px] font-medium text-marrs">
          {featured ? "最新扫描" : "扫描"}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">
          <time dateTime={scan.date} className="tabular-nums">
            {formatScanDate(scan.date)}
          </time>
        </p>
        {meta ? (
          <p className="mt-3 text-xs leading-5 tabular-nums text-muted">
            {meta.queries} 词
            <br />
            {meta.linked}/{meta.total} 直链
          </p>
        ) : null}
      </div>
      <div>
        <h2
          className={`leading-snug font-medium tracking-tight text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-[1.35rem]"
          }`}
        >
          {scan.title}
        </h2>
        <p className="mt-3 text-sm tabular-nums text-muted">
          {sourceLabel(scan.sources)}
          <span className="mx-2 text-line">·</span>
          {scan.articleCount} 篇
        </p>
        {scan.notes ? (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-ink/75">
            {scan.notes}
          </p>
        ) : null}
        <p className="mt-5 text-sm font-medium text-marrs">
          进入工作台
          <span className="ml-1 inline-block transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
