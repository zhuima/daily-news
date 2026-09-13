import { isAllowedArticleUrl } from "@/lib/articles";
import type { WechatExportRow } from "@/lib/import-wechat-export";
import type { TrackScanDb } from "@/lib/db/client";
import { touchCatalogMeta, upsertArticleUrl } from "@/lib/db/catalog";
import type { ArticleRow } from "@/lib/db/rows";

export type ImportResult = {
  matched: number;
  inserted: number;
  skipped: number;
  scanId: string;
};

export async function importArticleLinks(
  db: TrackScanDb,
  scanId: string,
  rows: WechatExportRow[],
): Promise<ImportResult> {
  const scan = await db
    .prepare("SELECT id, scan_date FROM scans WHERE id = ?")
    .bind(scanId)
    .first<{ id: string; scan_date: string }>();

  if (!scan) {
    throw new Error(`扫描批次不存在：${scanId}`);
  }

  let matched = 0;
  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!isAllowedArticleUrl(row.url)) {
      skipped += 1;
      continue;
    }

    const existing = await db
      .prepare(
        `SELECT id FROM articles
         WHERE scan_id = ? AND account = ? AND title = ?
         LIMIT 1`,
      )
      .bind(scanId, row.account, row.title)
      .first<Pick<ArticleRow, "id">>();

    if (existing?.id) {
      await upsertArticleUrl(db, {
        id: existing.id,
        scanId,
        scanDate: scan.scan_date,
        title: row.title,
        account: row.account,
        url: row.url,
        publishedLabel: row.publishedLabel,
        summary: row.summary,
      });
      matched += 1;
      continue;
    }

    await upsertArticleUrl(db, {
      scanId,
      scanDate: scan.scan_date,
      title: row.title,
      account: row.account,
      url: row.url,
      publishedLabel: row.publishedLabel,
      summary: row.summary,
    });
    inserted += 1;
  }

  await touchCatalogMeta(db);

  return { matched, inserted, skipped, scanId };
}
