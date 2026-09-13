import type { ArticleEngagement } from "@/lib/engagement/types";
import { parseCountValue } from "@/lib/engagement/parse-count";

/**
 * Best-effort parse of mp page HTML. Often blocked or login-walled — failures are normal.
 */
export async function tryFetchMpEngagement(
  url: string,
): Promise<ArticleEngagement | undefined> {
  if (!/mp\.weixin\.qq\.com/i.test(url)) return undefined;

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TrackScan/1.0; +https://news.affdirs.com)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return undefined;
    const html = await res.text();

    const pick = (patterns: RegExp[]) => {
      for (const re of patterns) {
        const m = re.exec(html);
        if (m?.[1]) {
          const v = parseCountValue(m[1]);
          if (v != null) return v;
        }
      }
      return undefined;
    };

    const readCount = pick([
      /read_num\s*[=:]\s*['"]?(\d+)['"]?/i,
      /var\s+read_num\s*=\s*['"]?(\d+)['"]?/i,
    ]);
    const likeCount = pick([
      /like_num\s*[=:]\s*['"]?(\d+)['"]?/i,
      /var\s+like_num\s*=\s*['"]?(\d+)['"]?/i,
    ]);
    const oldLikeCount = pick([
      /old_like_num\s*[=:]\s*['"]?(\d+)['"]?/i,
    ]);
    const commentCount = pick([
      /comment_num\s*[=:]\s*['"]?(\d+)['"]?/i,
    ]);

    const engagement: ArticleEngagement = {};
    if (readCount != null) engagement.readCount = readCount;
    if (likeCount != null) engagement.likeCount = likeCount;
    if (oldLikeCount != null) engagement.oldLikeCount = oldLikeCount;
    if (commentCount != null) engagement.commentCount = commentCount;

    if (
      engagement.readCount ||
      engagement.likeCount ||
      engagement.oldLikeCount ||
      engagement.commentCount
    ) {
      engagement.engagementUpdatedAt = new Date().toISOString();
      return engagement;
    }
  } catch {
    /* network / timeout / blocked */
  }
  return undefined;
}

export function mergeEngagement(
  primary?: ArticleEngagement,
  fallback?: ArticleEngagement,
): ArticleEngagement | undefined {
  const out: ArticleEngagement = { ...(fallback ?? {}), ...(primary ?? {}) };
  if (
    !out.readCount &&
    !out.likeCount &&
    !out.oldLikeCount &&
    !out.commentCount &&
    !out.shareCount
  ) {
    return undefined;
  }
  if (primary?.engagementUpdatedAt) {
    out.engagementUpdatedAt = primary.engagementUpdatedAt;
  } else if (fallback?.engagementUpdatedAt) {
    out.engagementUpdatedAt = fallback.engagementUpdatedAt;
  }
  return out;
}
