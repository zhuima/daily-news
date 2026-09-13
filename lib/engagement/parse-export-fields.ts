import type { ArticleEngagement } from "@/lib/engagement/types";
import { parseCountValue } from "@/lib/engagement/parse-count";

function pickField(
  record: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    if (keys.some((k) => lower.includes(k.toLowerCase()))) {
      return record[key];
    }
  }
  for (const key of keys) {
    if (record[key] !== undefined) return record[key];
  }
  return undefined;
}

export function parseEngagementFromRecord(
  record: Record<string, unknown>,
): ArticleEngagement | undefined {
  const readCount = parseCountValue(
    pickField(record, [
      "read_count",
      "readnum",
      "read_num",
      "阅读",
      "阅读量",
      "阅读数",
    ]),
  );
  const likeCount = parseCountValue(
    pickField(record, [
      "like_count",
      "likenum",
      "like_num",
      "点赞",
      "点赞数",
      "赞",
    ]),
  );
  const oldLikeCount = parseCountValue(
    pickField(record, [
      "old_like_count",
      "old_like",
      "在看",
      "在看数",
      "view_count",
    ]),
  );
  const commentCount = parseCountValue(
    pickField(record, [
      "comment_count",
      "commentnum",
      "评论",
      "评论数",
    ]),
  );
  const shareCount = parseCountValue(
    pickField(record, ["share_count", "sharenum", "分享", "分享数", "转发"]),
  );

  const engagement: ArticleEngagement = {};
  if (readCount != null) engagement.readCount = readCount;
  if (likeCount != null) engagement.likeCount = likeCount;
  if (oldLikeCount != null) engagement.oldLikeCount = oldLikeCount;
  if (commentCount != null) engagement.commentCount = commentCount;
  if (shareCount != null) engagement.shareCount = shareCount;

  if (
    engagement.readCount ||
    engagement.likeCount ||
    engagement.oldLikeCount ||
    engagement.commentCount ||
    engagement.shareCount
  ) {
    engagement.engagementUpdatedAt = new Date().toISOString();
    return engagement;
  }
  return undefined;
}

export function parseEngagementFromCsvColumns(
  headers: string[],
  cols: string[],
): ArticleEngagement | undefined {
  const record: Record<string, unknown> = {};
  headers.forEach((h, i) => {
    record[h] = cols[i] ?? "";
  });
  return parseEngagementFromRecord(record);
}
