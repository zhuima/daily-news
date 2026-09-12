import Link from "next/link";
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
            列表中的条目均含公众号、发布时间与可验证原文链接。点击后在右侧打开摘要，并用「打开原文」跳转微信文章。
          </p>
        </div>
        <p className="text-xs text-muted">扫描 {scanId}</p>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
          {article.channel}
        </p>
        <Link
          href={closeHref}
          scroll={false}
          className="text-xs text-muted hover:text-marrs"
        >
          关闭
        </Link>
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
          <dd className="mt-1 text-ink">{article.publishedLabel}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-marrs">检索词</dt>
          <dd className="mt-1 text-ink">{article.query}</dd>
        </div>
      </dl>
      <p className="mt-6 flex-1 text-[15px] leading-8 text-ink/85">
        {article.summary}
      </p>
      <div className="mt-8 border-t border-line pt-6">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-sm bg-marrs px-5 text-sm text-white transition-colors hover:bg-marrs-deep"
        >
          打开原文
        </a>
        <p className="mt-3 break-all text-xs text-muted">{article.url}</p>
      </div>
    </article>
  );
}
