import Link from "next/link";
import type { Article } from "@/lib/types";

export function ArticleRow({
  article,
  scanId,
  selected,
}: {
  article: Article;
  scanId: string;
  selected: boolean;
}) {
  return (
    <Link
      href={`/scans/${scanId}?article=${encodeURIComponent(article.id)}`}
      scroll={false}
      aria-current={selected ? "page" : undefined}
      className={`block border-l-2 px-4 py-4 transition-colors sm:px-5 ${
        selected
          ? "border-marrs bg-marrs/[0.06]"
          : "border-transparent hover:bg-canvas"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-wide text-muted">
        <span className="text-marrs">{article.channel}</span>
        <span>·</span>
        <span>{article.query}</span>
      </div>
      <h3 className="mt-1.5 text-[15px] leading-6 text-ink">{article.title}</h3>
      <p className="mt-2 text-sm text-ink">
        <span className="text-marrs">{article.account}</span>
        <span className="mx-2 text-muted">·</span>
        <span>{article.publishedLabel}</span>
      </p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/70">
        {article.summary}
      </p>
      <p className="mt-2 text-xs text-marrs">打开原文 →</p>
    </Link>
  );
}
