export const SITE_NAME = "赛道扫描";
export const SITE_TAGLINE = "微信读书关键词扫描归档 · daily-news";
export const SITE_DESCRIPTION =
  "赛道扫描（Track Scan）归档微信读书等来源的赛道关键词扫描结果：按日期浏览文章，展示公众号、发布时间与可验证的微信公众号原文链接。";
export const SITE_LOCALE = "zh-CN";

export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    process.env.VERCEL_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
  }
  return "https://news.affdirs.com";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
