import type { Article } from "@/lib/types";

/** Seed placeholder paths — not real WeChat article URLs. */
const SYNTHETIC_MP_PATH =
  /^https?:\/\/mp\.weixin\.qq\.com\/s\/(?:20\d{2}-\d{2}-\d{2}-weread-\d+|[^?]+)$/i;

export type ArticleLinkKind = "mp-direct" | "sogou-search";

export type ArticleLink = {
  href: string;
  kind: ArticleLinkKind;
  label: string;
  hint?: string;
};

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

export function sogouWeixinSearchUrl(article: Article): string {
  const query = `${article.title} ${article.account}`.trim();
  return `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(query)}`;
}

export function resolveArticleLink(article: Article): ArticleLink {
  if (isVerifiableArticleUrl(article.url)) {
    return {
      href: article.url.trim(),
      kind: "mp-direct",
      label: "打开原文",
    };
  }
  return {
    href: sogouWeixinSearchUrl(article),
    kind: "sogou-search",
    label: "打开原文",
    hint: "暂无已验证的公众号直链，将通过搜狗微信搜索该标题与公众号。",
  };
}

export function normalizeArticle(article: Article): Article {
  const verified = isVerifiableArticleUrl(article.url);
  return {
    ...article,
    account: article.account?.trim() || "未知公众号",
    publishedLabel: article.publishedLabel?.trim() || "时间待补",
    url: verified ? article.url.trim() : article.url?.trim() ?? "",
    hasDirectLink: verified,
  };
}
