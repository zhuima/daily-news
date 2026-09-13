import Link from "next/link";
import { ArticleScoreChip } from "@/components/ArticleScoreChip";
import { ArticleLinkActions } from "@/components/ArticleLinkActions";
import { resolveArticleLink } from "@/lib/articles";
import type { Article } from "@/lib/types";

export function ReadingPanel({
  article,
  scanId,
  closeHref,
}: {
  article?: Article;
  scanId: string;
  closeHref: string;
}) {
  if (!article) {
    return (
      <div className="flex h-full min-h-[280px] flex-col justify-between p-7 sm:p-9">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
            Reading
          </p>
          <h2 className="mt-4 text-2xl tracking-tight text-ink">选择一篇文章</h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
            每篇展示公众号与发布时间。仅当数据里存在已验证的 mp 或搜狗 link
            跳转时，才显示可点击的「打开原文」。
          </p>
        </div>
        <p className="text-xs text-muted">扫描 {scanId}</p>
      </div>
    );
  }

  const link = resolveArticleLink(article);

  return (
    <article className="flex h-full flex-col p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
          {article.channel}
        </p>
        <div className="flex flex-col items-end gap-2">
          <ArticleScoreChip article={article} showReason />
          <Link
            href={closeHref}
            scroll={false}
            className="text-xs text-muted hover:text-marrs"
          >
            关闭
          </Link>
        </div>
      </div>
      <h2 className="mt-4 text-[1.65rem] leading-snug tracking-tight text-ink">
        {article.title}
      </h2>
      <dl className="mt-4 grid gap-3 rounded-sm border border-line bg-canvas px-4 py-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-marrs">公众号</dt>
          <dd className="mt-1 text-ink">{article.account}</dd>
        </div>
        <div>
          <dt className="text-xs text-marrs">发布时间</dt>
          <dd className="mt-1 text-ink">
            <time dateTime={article.scanDate}>{article.publishedLabel}</time>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-marrs">检索词</dt>
          <dd className="mt-1 text-ink">{article.query}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-marrs">原文链接</dt>
          <dd className="mt-1 text-ink">
            {link ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-marrs hover:text-marrs-deep"
              >
                {link.href}
              </a>
            ) : (
              "待收录（不可用搜索页代替）"
            )}
          </dd>
        </div>
      </dl>
      <p className="mt-6 flex-1 text-[15px] leading-8 text-ink/85">
        {article.summary}
      </p>
      <ArticleLinkActions article={article} />
    </article>
  );
}
