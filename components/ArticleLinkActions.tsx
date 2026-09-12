import { resolveArticleLink } from "@/lib/articles";
import type { Article } from "@/lib/types";

export function ArticleLinkActions({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  const link = resolveArticleLink(article);
  const ariaLabel = link
    ? `打开原文：${article.title}`
    : undefined;

  return (
    <div className={compact ? "" : "mt-8 border-t border-line pt-6"}>
      {link ? (
        <>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="inline-flex h-11 items-center rounded-sm bg-marrs px-5 text-sm text-white transition-colors hover:bg-marrs-deep"
          >
            {link.label}
          </a>
          <p className="mt-3 break-all text-xs text-muted">{link.href}</p>
        </>
      ) : (
        <div className="rounded-sm border border-line bg-canvas px-4 py-3 text-sm leading-7 text-muted">
          <p className="text-ink">原文链接待收录</p>
          <p className="mt-1">
            本篇暂无已验证的微信公众号直链。请在扫描数据或公众号页补全{" "}
            <code className="text-xs">url</code> 后重新部署；勿使用搜狗搜索页作为「打开原文」。
          </p>
        </div>
      )}
    </div>
  );
}
