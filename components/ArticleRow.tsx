import Link from "next/link";
import { resolveArticleLink } from "@/lib/articles";
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
  const outbound = resolveArticleLink(article);

  return (
    <div
      className={`border-l-2 transition-colors ${
        selected
          ? "border-marrs bg-marrs/[0.06]"
          : "border-transparent hover:bg-canvas"
      }`}
    >
      <Link
        href={`/scans/${scanId}?article=${encodeURIComponent(article.id)}`}
        scroll={false}
        aria-current={selected ? "page" : undefined}
        className="block px-4 py-4 sm:px-5"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-wide text-muted">
          <span className="text-marrs">{article.channel}</span>
          <span>·</span>
          <span>{article.query}</span>
          {article.hasDirectLink ? (
            <>
              <span>·</span>
              <span>直链</span>
            </>
          ) : null}
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
      </Link>
      <div className="px-4 pb-4 sm:px-5">
        <a
          href={outbound.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-xs text-marrs hover:text-marrs-deep"
        >
          {outbound.label} →
        </a>
      </div>
    </div>
  );
}
