import { isAllowedArticleUrl } from "@/lib/articles";
import {
  mergeEngagement,
  tryFetchMpEngagement,
} from "@/lib/engagement/fetch-mp-stats";
import { hasEngagementMetrics } from "@/lib/engagement/types";
import type { WechatExportRow } from "@/lib/import-wechat-export";
import type { TrackScanDb } from "@/lib/db/client";
import { touchCatalogMeta, upsertArticleUrl } from "@/lib/db/catalog";
import type { ArticleRow } from "@/lib/db/rows";

export type ImportResult = {
  matched: number;
  inserted: number;
  skipped: number;
  scanId: string;
  engagementFromMp: number;
};

export type ImportOptions = {
  /** 导出无互动列时，best-effort 抓取 mp 页（可能失败） */
  tryMpEngagement?: boolean;
};

async function resolveEngagement(
  row: WechatExportRow,
  tryMp: boolean,
): Promise<WechatExportRow["engagement"]> {
  let engagement = row.engagement;
  if (tryMp && !hasEngagementMetrics(engagement) && row.url.includes("mp.weixin.qq.com")) {
    const fetched = await tryFetchMpEngagement(row.url);
    engagement = mergeEngagement(engagement, fetched);
  }
  return engagement;
}

export async function importArticleLinks(
  db: TrackScanDb,
  scanId: string,
  rows: WechatExportRow[],
  options: ImportOptions = {},
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
  let engagementFromMp = 0;

  for (const row of rows) {
    if (!isAllowedArticleUrl(row.url)) {
      skipped += 1;
      continue;
    }

    const engagement = await resolveEngagement(row, options.tryMpEngagement ?? false);
    if (
      options.tryMpEngagement &&
      hasEngagementMetrics(engagement) &&
      !hasEngagementMetrics(row.engagement)
    ) {
      engagementFromMp += 1;
    }

    const existing = await db
      .prepare(
        `SELECT id FROM articles
         WHERE scan_id = ? AND account = ? AND title = ?
         LIMIT 1`,
      )
      .bind(scanId, row.account, row.title)
      .first<Pick<ArticleRow, "id">>();

    const payload = {
      scanId,
      scanDate: scan.scan_date,
      title: row.title,
      account: row.account,
      url: row.url,
      publishedLabel: row.publishedLabel,
      summary: row.summary,
      engagement,
    };

    if (existing?.id) {
      await upsertArticleUrl(db, { ...payload, id: existing.id });
      matched += 1;
      continue;
    }

    await upsertArticleUrl(db, payload);
    inserted += 1;
  }

  await touchCatalogMeta(db);

  return { matched, inserted, skipped, scanId, engagementFromMp };
}
