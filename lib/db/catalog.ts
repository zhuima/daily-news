import type { Article, Catalog, Scan } from "@/lib/types";
import type { TrackScanDb } from "@/lib/db/client";
import {
  articleRowToArticle,
  scanRowToScan,
  type ArticleRow,
  type ScanRow,
} from "@/lib/db/rows";

async function countArticlesForScan(db: TrackScanDb, scanId: string) {
  const row = await db
    .prepare("SELECT COUNT(*) AS c FROM articles WHERE scan_id = ?")
    .bind(scanId)
    .first<{ c: number }>();
  return row?.c ?? 0;
}

export async function loadCatalogFromDb(db: TrackScanDb): Promise<Catalog> {
  const metaRows = await db
    .prepare("SELECT key, value FROM catalog_meta")
    .all<{ key: string; value: string }>();

  const meta = new Map(
    (metaRows.results ?? []).map((r) => [r.key, r.value] as const),
  );

  const scanRows = await db
    .prepare("SELECT * FROM scans ORDER BY scan_date DESC")
    .all<ScanRow>();

  const articleRows = await db
    .prepare("SELECT * FROM articles ORDER BY scan_date DESC, id ASC")
    .all<ArticleRow>();

  const articles = (articleRows.results ?? []).map(articleRowToArticle);

  const scans: Scan[] = [];
  for (const row of scanRows.results ?? []) {
    const count = await countArticlesForScan(db, row.id);
    scans.push(scanRowToScan(row, count));
  }

  return {
    version: meta.get("version") ?? "1.0.0",
    updatedAt: meta.get("updatedAt") ?? new Date().toISOString(),
    scans,
    articles,
  };
}

export async function getScansFromDb(db: TrackScanDb): Promise<Scan[]> {
  const catalog = await loadCatalogFromDb(db);
  return [...catalog.scans].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getScanFromDb(
  db: TrackScanDb,
  scanId: string,
): Promise<Scan | undefined> {
  const row = await db
    .prepare("SELECT * FROM scans WHERE id = ?")
    .bind(scanId)
    .first<ScanRow>();
  if (!row) return undefined;
  const count = await countArticlesForScan(db, scanId);
  return scanRowToScan(row, count);
}

export async function getArticlesByScanFromDb(
  db: TrackScanDb,
  scanId: string,
): Promise<Article[]> {
  const rows = await db
    .prepare(
      "SELECT * FROM articles WHERE scan_id = ? ORDER BY id ASC",
    )
    .bind(scanId)
    .all<ArticleRow>();
  return (rows.results ?? []).map(articleRowToArticle);
}

export async function getAllArticlesFromDb(db: TrackScanDb): Promise<Article[]> {
  const rows = await db
    .prepare("SELECT * FROM articles ORDER BY scan_date DESC, id ASC")
    .all<ArticleRow>();
  return (rows.results ?? []).map(articleRowToArticle);
}

export async function getArticleFromDb(
  db: TrackScanDb,
  id: string,
): Promise<Article | undefined> {
  const row = await db
    .prepare("SELECT * FROM articles WHERE id = ?")
    .bind(id)
    .first<ArticleRow>();
  return row ? articleRowToArticle(row) : undefined;
}

export async function searchArticlesInDb(
  db: TrackScanDb,
  query: string,
): Promise<Article[]> {
  const needle = `%${query.trim().toLowerCase()}%`;
  if (query.trim() === "") return getAllArticlesFromDb(db);

  const rows = await db
    .prepare(
      `SELECT * FROM articles
       WHERE lower(title) LIKE ?
          OR lower(account) LIKE ?
          OR lower(summary) LIKE ?
          OR lower(query) LIKE ?
          OR lower(url) LIKE ?
       ORDER BY scan_date DESC, id ASC`,
    )
    .bind(needle, needle, needle, needle, needle)
    .all<ArticleRow>();

  return (rows.results ?? []).map(articleRowToArticle);
}

export async function upsertArticleUrl(
  db: TrackScanDb,
  input: {
    id?: string;
    scanId: string;
    scanDate: string;
    title: string;
    account: string;
    accountSlug?: string;
    url: string;
    publishedLabel?: string;
    summary?: string;
    query?: string;
    channel?: string;
  },
): Promise<string> {
  const allowed =
    input.url.trim().startsWith("http") &&
    !/^https?:\/\/weixin\.sogou\.com\/weixin\?/i.test(input.url);

  const hasDirect = allowed ? 1 : 0;
  const url = allowed ? input.url.trim() : "";

  if (input.id) {
    await db
      .prepare(
        `UPDATE articles SET url = ?, has_direct_link = ?, account_slug = COALESCE(?, account_slug)
         WHERE id = ?`,
      )
      .bind(url, hasDirect, input.accountSlug ?? null, input.id)
      .run();
    return input.id;
  }

  const id = `${input.scanDate}-import-${crypto.randomUUID().slice(0, 8)}`;
  await db
    .prepare(
      `INSERT INTO articles (
        id, scan_id, scan_date, channel, query, title, account, account_slug,
        published_label, summary, url, has_direct_link, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'wechat-export')`,
    )
    .bind(
      id,
      input.scanId,
      input.scanDate,
      input.channel ?? "微信公众号",
      input.query ?? "",
      input.title,
      input.account,
      input.accountSlug ?? null,
      input.publishedLabel ?? "",
      input.summary ?? "",
      url,
      hasDirect,
    )
    .run();
  return id;
}

export async function touchCatalogMeta(db: TrackScanDb): Promise<void> {
  await db
    .prepare(
      `INSERT INTO catalog_meta (key, value) VALUES ('updatedAt', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .bind(new Date().toISOString())
    .run();
}
