import Link from "next/link";
import type { Scan } from "@/lib/types";
import { formatScanDate, sourceLabel } from "@/lib/format";

export function ScanCard({ scan }: { scan: Scan }) {
  return (
    <Link
      href={`/scans/${scan.id}`}
      className="group block rounded-sm bg-paper p-7 shadow-[0_1px_0_rgba(28,27,25,0.04)] ring-1 ring-line transition-shadow hover:shadow-[0_12px_40px_-24px_rgba(1,132,126,0.55)] sm:p-9"
    >
      <p className="font-display text-xs tracking-[0.18em] text-marrs uppercase">
        {formatScanDate(scan.date)}
      </p>
      <h2 className="mt-3 text-2xl leading-snug tracking-tight text-ink sm:text-[1.65rem]">
        {scan.title}
      </h2>
      <p className="mt-4 text-sm text-muted">
        {sourceLabel(scan.sources)}
        <span className="mx-2 text-line">·</span>
        {scan.articleCount} 篇
      </p>
      {scan.notes ? (
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/75">
          {scan.notes}
        </p>
      ) : null}
      <p className="mt-6 text-sm text-marrs">
        进入本次扫描
        <span className="ml-1 transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </p>
    </Link>
  );
}
