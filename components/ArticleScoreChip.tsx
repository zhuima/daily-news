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
    <span className={`inline-flex flex-col gap-0.5 ${className}`}>
      <span
        className="inline-flex items-center rounded-sm bg-marrs px-2 py-0.5 text-[11px] font-medium tabular-nums text-white"
        title={article.scoreReason ?? "质量分"}
      >
        质量分 {score}
      </span>
      {showReason && article.scoreReason ? (
        <span className="text-[10px] leading-snug text-muted">
          {article.scoreReason}
        </span>
      ) : null}
    </span>
  );
}
