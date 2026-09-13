/** 互动数据：仅展示/元数据，不参与质量分 */
export type ArticleEngagement = {
  readCount?: number;
  likeCount?: number;
  /** 微信「在看」等历史字段 */
  oldLikeCount?: number;
  commentCount?: number;
  shareCount?: number;
  engagementUpdatedAt?: string;
};

export function hasEngagementMetrics(e: ArticleEngagement | undefined): boolean {
  if (!e) return false;
  return (
    (e.readCount ?? 0) > 0 ||
    (e.likeCount ?? 0) > 0 ||
    (e.oldLikeCount ?? 0) > 0 ||
    (e.commentCount ?? 0) > 0 ||
    (e.shareCount ?? 0) > 0
  );
}
