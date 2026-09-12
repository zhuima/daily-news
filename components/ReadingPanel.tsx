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
            左侧列表通过 URL 参数{" "}
            <code className="rounded-sm bg-canvas px-1.5 py-0.5 text-xs">
              ?article=
            </code>{" "}
            打开阅读面板。刷新或分享链接会停留在同一篇。
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
      <p className="mt-3 text-sm text-muted">
        {article.account}
        <span className="mx-2">·</span>
        {article.publishedLabel}
        <span className="mx-2">·</span>
        {article.query}
      </p>
      <p className="mt-6 flex-1 text-[15px] leading-8 text-ink/85">
        {article.summary}
      </p>
      <div className="mt-8 border-t border-line pt-6">
        {article.hasDirectLink && article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-sm bg-marrs px-5 text-sm text-white transition-colors hover:bg-marrs-deep"
          >
            打开原文
          </a>
        ) : (
          <p className="text-sm leading-7 text-muted">
            这篇没有可直达的公众号链接。微信侧可能未开放外链，或扫描时只保留了摘要。
          </p>
        )}
      </div>
    </article>
  );
}
