import type { Article } from "@/lib/types";

export function ArticleScoreChip({
  article,
  showReason = false,
  className = "",
}: {
  article: Article;
  showReason?: boolean;
  className?: string;
}) {
  const score = article.score ?? 0;
  return (
    <span className={`inline-flex flex-col items-end gap-0.5 ${className}`}>
      <span
        className="text-[12px] tabular-nums text-muted"
        title={article.scoreReason ?? "质量分"}
      >
        质量分 {score}
      </span>
      {showReason && article.scoreReason ? (
        <span className="max-w-[16rem] text-right text-[11px] leading-snug text-muted">
          {article.scoreReason}
        </span>
      ) : null}
    </span>
  );
}
