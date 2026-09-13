import { scoreArticleQuality } from "@/lib/scoring/content-quality-score";
import type { TrackScanDb } from "@/lib/db/client";

export function computeStoredScore(input: {
  title: string;
  summary: string;
  query: string;
  url: string;
  publishedLabel: string;
  hasDirectLink: boolean;
}) {
  return scoreArticleQuality({
    title: input.title,
    summary: input.summary,
    publishedLabel: input.publishedLabel,
    hasDirectLink: input.hasDirectLink,
    url: input.url,
  });
}

export async function persistArticleScore(
  db: TrackScanDb,
  articleId: string,
  input: Parameters<typeof computeStoredScore>[0],
): Promise<void> {
  const { score, scoreReason } = computeStoredScore(input);
  await db
    .prepare(
      `UPDATE articles SET score = ?, score_reason = ? WHERE id = ?`,
    )
    .bind(score, scoreReason, articleId)
    .run();
}

export async function rescoreAllArticlesInDb(db: TrackScanDb): Promise<number> {
  const rows = await db
    .prepare(
      `SELECT id, title, summary, query, url, published_label, has_direct_link
       FROM articles`,
    )
    .all<{
      id: string;
      title: string;
      summary: string;
      query: string;
      url: string;
      published_label: string;
      has_direct_link: number;
    }>();

  const list = rows.results ?? [];
  const batch = [];

  for (const row of list) {
    const { score, scoreReason } = computeStoredScore({
      title: row.title,
      summary: row.summary,
      query: row.query,
      url: row.url,
      publishedLabel: row.published_label,
      hasDirectLink: row.has_direct_link === 1,
    });
    batch.push(
      db
        .prepare(
          `UPDATE articles SET score = ?, score_reason = ? WHERE id = ?`,
        )
        .bind(score, scoreReason, row.id),
    );
  }

  if (batch.length > 0) {
    await db.batch(batch);
  }
  return batch.length;
}
