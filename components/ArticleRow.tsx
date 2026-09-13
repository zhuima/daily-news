import Link from "next/link";
import { ArticleEngagement } from "@/components/ArticleEngagement";
import { ArticleScoreChip } from "@/components/ArticleScoreChip";
import { OriginalArticleLink } from "@/components/OriginalArticleLink";
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
      className={`border-l-2 ${
        selected
          ? "border-marrs bg-paper"
          : "border-transparent hover:bg-paper/70"
      }`}
    >
      <Link
        href={`/scans/${scanId}?article=${encodeURIComponent(article.id)}`}
        scroll={false}
        aria-current={selected ? "page" : undefined}
        className="focus-ring block px-3 py-3 sm:px-4"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[14px] leading-6 font-medium tracking-tight text-pretty text-ink">
            {article.title}
          </h3>
          <ArticleScoreChip article={article} className="shrink-0" />
        </div>
        <p className="mt-1 text-[12px] text-muted">
          {article.account}
          <span className="mx-1.5">·</span>
          <time dateTime={article.scanDate} className="tabular-nums">
            {article.publishedLabel}
          </time>
          <span className="mx-1.5">·</span>
          {article.query}
          {article.hasDirectLink ? null : (
            <>
              <span className="mx-1.5">·</span>
              链接待补
            </>
          )}
        </p>
        <ArticleEngagement article={article} className="mt-1" />
      </Link>
      {outbound ? (
        <div className="px-3 pb-3 sm:px-4">
          <OriginalArticleLink article={article} className="text-[12px]" />
        </div>
      ) : null}
    </div>
  );
}
