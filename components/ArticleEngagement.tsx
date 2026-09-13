import type { Article } from "@/lib/types";
import { hasEngagementMetrics } from "@/lib/engagement/types";

function formatCount(n: number): string {
  if (n >= 10000) {
    const wan = n / 10000;
    return `${wan % 1 === 0 ? wan : wan.toFixed(1).replace(/\.0$/, "")}万`;
  }
  return n.toLocaleString("zh-CN");
}

export function ArticleEngagement({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  const e = {
    readCount: article.readCount,
    likeCount: article.likeCount,
    oldLikeCount: article.oldLikeCount,
    commentCount: article.commentCount,
    shareCount: article.shareCount,
  };
  if (!hasEngagementMetrics(e)) return null;

  const parts: string[] = [];
  if (e.readCount && e.readCount > 0) {
    parts.push(`阅读 ${formatCount(e.readCount)}`);
  }
  if (e.likeCount && e.likeCount > 0) {
    parts.push(`点赞 ${formatCount(e.likeCount)}`);
  }
  if (e.oldLikeCount && e.oldLikeCount > 0) {
    parts.push(`在看 ${formatCount(e.oldLikeCount)}`);
  }
  if (e.commentCount && e.commentCount > 0) {
    parts.push(`评论 ${formatCount(e.commentCount)}`);
  }
  if (e.shareCount && e.shareCount > 0) {
    parts.push(`分享 ${formatCount(e.shareCount)}`);
  }

  if (parts.length === 0) return null;

  return (
    <p className={`text-[11px] text-muted ${className}`}>
      {parts.join(" · ")}
    </p>
  );
}
