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
  const ariaLabel = link ? `打开原文：${article.title}` : undefined;

  return (
    <div className={compact ? "" : "mt-8 border-t border-line pt-5"}>
      {link ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className="btn-solid"
        >
          查看原文 →
        </a>
      ) : (
        <div className="meta-block px-4 py-3 text-sm leading-7 text-muted">
          <p className="font-medium text-ink">原文链接待收录</p>
          <p className="mt-1">
            本篇暂无已验证的微信公众号直链。请通过 wechatDownload 导出或扫描数据补全链接；勿使用搜狗搜索页作为「打开原文」。
          </p>
        </div>
      )}
    </div>
  );
}
