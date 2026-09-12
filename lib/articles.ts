import type { Article } from "@/lib/types";

const SYNTHETIC_MP_PATH =
  /^https?:\/\/mp\.weixin\.qq\.com\/s\/(?:20\d{2}-\d{2}-\d{2}-weread-\d+|[^?]+)$/i;

const SOGOU_SEARCH =
  /^https?:\/\/weixin\.sogou\.com\/weixin\?/i;

export type ArticleLinkKind = "mp-direct" | "sogou-link";

export type ArticleLink = {
  href: string;
  kind: ArticleLinkKind;
  label: string;
};

export function isAllowedArticleUrl(url: string | undefined): boolean {
  const trimmed = url?.trim() ?? "";
  if (!trimmed.startsWith("http")) return false;
  if (SOGOU_SEARCH.test(trimmed)) return false;
  if (/weixin\.sogou\.com\/link/i.test(trimmed)) return true;
  if (trimmed.includes("mp.weixin.qq.com")) {
    if (SYNTHETIC_MP_PATH.test(trimmed) && !trimmed.includes("__biz=")) {
      return false;
    }
    return (
      trimmed.includes("__biz=") ||
      (trimmed.includes("mid=") && trimmed.includes("sn="))
    );
  }
  return false;
}

export function resolveArticleLink(article: Article): ArticleLink | null {
  if (!isAllowedArticleUrl(article.url)) return null;
  const href = article.url.trim();
  return {
    href,
    kind: href.includes("weixin.sogou.com/link") ? "sogou-link" : "mp-direct",
    label: "打开原文",
  };
}

export function normalizeArticle(article: Article): Article {
  const allowed = isAllowedArticleUrl(article.url);
  return {
    ...article,
    account: article.account?.trim() || "未知公众号",
    publishedLabel: article.publishedLabel?.trim() || "时间待补",
    url: allowed ? article.url.trim() : "",
    hasDirectLink: allowed,
  };
}

export function publishedDateTime(article: Article): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(article.scanDate)) {
    return `${article.scanDate}T12:00:00+08:00`;
  }
  return article.scanDate;
}
