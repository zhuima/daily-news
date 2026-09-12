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
      className={`group grid gap-6 bg-paper ring-1 ring-line transition-all hover:ring-marrs/35 hover:shadow-[0_20px_50px_-30px_rgba(1,132,126,0.45)] sm:grid-cols-[7rem_1fr] ${
        featured ? "p-8 sm:p-10" : "p-6 sm:p-7"
      }`}
    >
      <div className="border-l-2 border-marrs pl-4 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-4">
        <p className="font-display text-[11px] tracking-[0.16em] text-marrs uppercase">
          Scan
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">
          <time dateTime={scan.date}>{formatScanDate(scan.date)}</time>
        </p>
        {meta ? (
          <p className="mt-3 text-xs leading-5 text-muted">
            {meta.queries} 词
            <br />
            {meta.linked}/{meta.total} 直链
          </p>
        ) : null}
      </div>
      <div>
        {featured ? (
          <p className="text-xs tracking-[0.14em] text-marrs">最新扫描</p>
        ) : null}
        <h2
          className={`mt-1 leading-snug tracking-tight text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          {scan.title}
        </h2>
        <p className="mt-3 text-sm text-muted">
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
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
