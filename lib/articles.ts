import type { Article } from "@/lib/types";

/** Seed placeholder paths — not real WeChat article URLs. */
const SYNTHETIC_MP_PATH =
  /^https?:\/\/mp\.weixin\.qq\.com\/s\/(?:20\d{2}-\d{2}-\d{2}-weread-\d+|[^?]+)$/i;

export function isVerifiableArticleUrl(url: string | undefined): boolean {
  const trimmed = url?.trim() ?? "";
  if (!trimmed.startsWith("http")) return false;
  if (SYNTHETIC_MP_PATH.test(trimmed) && !trimmed.includes("__biz=")) {
    return false;
  }
  if (trimmed.includes("mp.weixin.qq.com")) {
    return (
      trimmed.includes("__biz=") ||
      (trimmed.includes("mid=") && trimmed.includes("sn="))
    );
  }
  if (
    trimmed.includes("weixin.sogou.com") ||
    trimmed.includes("weread.qq.com")
  ) {
    return true;
  }
  return false;
}

export function isPublishableArticle(article: Article): boolean {
  if (!article.account?.trim()) return false;
  if (!article.publishedLabel?.trim()) return false;
  if (!isVerifiableArticleUrl(article.url)) return false;
  return true;
}

export function withPublishableLink(article: Article): Article {
  return {
    ...article,
    url: article.url.trim(),
    hasDirectLink: true,
  };
}
