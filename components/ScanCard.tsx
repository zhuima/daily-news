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
      className="focus-ring group grid gap-2 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
    >
      <p className="text-[13px] tabular-nums text-muted">
        <time dateTime={scan.date}>{formatScanDate(scan.date)}</time>
        {featured ? <span className="ml-2 text-marrs">最新</span> : null}
      </p>
      <div className="min-w-0">
        <h2 className="text-[15px] font-medium leading-6 tracking-tight text-ink group-hover:text-marrs">
          {scan.title}
        </h2>
        <p className="mt-1 text-[13px] tabular-nums text-muted">
          {sourceLabel(scan.sources)}
          {meta ? (
            <>
              <span className="mx-1.5 text-line">·</span>
              {meta.queries} 词
              <span className="mx-1.5 text-line">·</span>
              {meta.linked}/{meta.total} 直链
            </>
          ) : (
            <>
              <span className="mx-1.5 text-line">·</span>
              {scan.articleCount} 篇
            </>
          )}
        </p>
      </div>
      <p className="text-[13px] font-medium text-marrs sm:text-right">
        进入工作台
        <span className="ml-1">→</span>
      </p>
    </Link>
  );
}
