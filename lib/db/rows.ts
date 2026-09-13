import type { Article, Scan } from "@/lib/types";
import { normalizeArticle } from "@/lib/articles";

export type AccountRow = {
  slug: string;
  name: string;
  added_at: string;
  notes: string;
};

export type ScanRow = {
  id: string;
  scan_date: string;
  title: string;
  sources_json: string;
  notes: string | null;
};

export type ArticleRow = {
  id: string;
  scan_id: string;
  scan_date: string;
  channel: string;
  query: string;
  title: string;
  account: string;
  account_slug: string | null;
  published_label: string;
  summary: string;
  url: string;
  has_direct_link: number;
  source: string | null;
  score: number | null;
  score_reason: string | null;
  read_count: number | null;
  like_count: number | null;
  old_like_count: number | null;
  comment_count: number | null;
  share_count: number | null;
  engagement_updated_at: string | null;
};

export function scanRowToScan(row: ScanRow, articleCount: number): Scan {
  let sources: string[] = [];
  try {
    sources = JSON.parse(row.sources_json) as string[];
  } catch {
    sources = [];
  }
  return {
    id: row.id,
    date: row.scan_date,
    title: row.title,
    sources,
    articleCount,
    notes: row.notes ?? undefined,
  };
}

export function articleRowToArticle(row: ArticleRow): Article {
  return normalizeArticle({
    id: row.id,
    scanDate: row.scan_date,
    channel: row.channel,
    query: row.query,
    title: row.title,
    account: row.account,
    publishedLabel: row.published_label,
    summary: row.summary,
    url: row.url,
    hasDirectLink: row.has_direct_link === 1,
    score: row.score ?? undefined,
    scoreReason: row.score_reason ?? undefined,
    readCount: row.read_count ?? undefined,
    likeCount: row.like_count ?? undefined,
    oldLikeCount: row.old_like_count ?? undefined,
    commentCount: row.comment_count ?? undefined,
    shareCount: row.share_count ?? undefined,
    engagementUpdatedAt: row.engagement_updated_at ?? undefined,
  });
}
