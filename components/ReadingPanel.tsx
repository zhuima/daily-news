import Link from "next/link";
import { ArticleEngagement } from "@/components/ArticleEngagement";
import { ArticleScoreChip } from "@/components/ArticleScoreChip";
import { ArticleLinkActions } from "@/components/ArticleLinkActions";
import { OriginalArticleLink } from "@/components/OriginalArticleLink";
import { hasEngagementMetrics } from "@/lib/engagement/types";
import { resolveArticleLink } from "@/lib/articles";
import type { Article } from "@/lib/types";

export function ReadingPanel({
  article,
  scanId,
  closeHref,
  variant = "panel",
}: {
  article?: Article;
  scanId: string;
  closeHref: string;
  variant?: "panel" | "sheet";
}) {
  const isSheet = variant === "sheet";

  if (!article) {
    return (
      <div className="flex h-full min-h-[240px] flex-col justify-between py-1">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            选择一篇文章
          </h2>
          <p className="type-prose mt-3 text-sm">
            每篇展示公众号与发布时间。仅当数据里存在已验证的 mp 或搜狗 link
            跳转时，才显示可点击的「打开原文」。
          </p>
        </div>
        <p className="text-[12px] tabular-nums text-muted">扫描 {scanId}</p>
      </div>
    );
  }

  const link = resolveArticleLink(article);
  const showEngagementHint =
    !hasEngagementMetrics({
      readCount: article.readCount,
      likeCount: article.likeCount,
      oldLikeCount: article.oldLikeCount,
      commentCount: article.commentCount,
      shareCount: article.shareCount,
    });

  return (
    <article className="flex h-full flex-col py-1">
      {isSheet ? (
        <div className="mb-5 flex items-center justify-between gap-3 px-5">
          <p className="text-[13px] text-muted">{article.channel}</p>
          <Link
            href={closeHref}
            scroll={false}
            className="btn-sheet-close"
            aria-label="关闭阅读面板"
          >
            关闭
          </Link>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <p className="text-[13px] text-muted">{article.channel}</p>
          <div className="flex flex-col items-end gap-1">
            <ArticleScoreChip article={article} showReason />
            <Link
              href={closeHref}
              scroll={false}
              className="focus-ring text-[13px] text-muted hover:text-marrs"
            >
              关闭
            </Link>
          </div>
        </div>
      )}
      <div className={isSheet ? "px-5" : undefined}>
        {isSheet ? <ArticleScoreChip article={article} showReason /> : null}
        <h2 className="mt-3 text-[1.45rem] leading-snug font-semibold tracking-tight text-pretty text-ink">
          {article.title}
        </h2>
        <ArticleEngagement article={article} className="mt-3" />
        {showEngagementHint ? (
          <p className="mt-2 text-[12px] leading-snug text-muted">
            互动数据需从 wechatDownload 导出导入
          </p>
        ) : null}
        <dl className="meta-block mt-5 grid gap-3 px-4 py-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[12px] text-muted">公众号</dt>
            <dd className="mt-1 text-ink">{article.account}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">发布时间</dt>
            <dd className="mt-1 text-ink">
              <time dateTime={article.scanDate} className="tabular-nums">
                {article.publishedLabel}
              </time>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[12px] text-muted">检索词</dt>
            <dd className="mt-1 text-ink">{article.query}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[12px] text-muted">原文</dt>
            <dd className="mt-1">
              {link ? (
                <OriginalArticleLink article={article} />
              ) : (
                <span className="text-sm text-muted">
                  原文链接待收录（不可用搜索页代替）
                </span>
              )}
            </dd>
          </div>
        </dl>
        <p className="type-prose mt-6 flex-1 text-[15px] leading-8">
          {article.summary}
        </p>
        <ArticleLinkActions article={article} />
      </div>
    </article>
  );
}
