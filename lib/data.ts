import type { Article, Catalog, Scan } from "@/lib/types";
import { getDb } from "@/lib/db/client";
import {
  getAllArticlesFromDb,
  getArticleFromDb,
  getArticlesByScanFromDb,
  getScanFromDb,
  getScansFromDb,
  loadCatalogFromDb,
  searchArticlesInDb,
} from "@/lib/db/catalog";
import {
  getJsonAllArticles,
  getJsonArticle,
  getJsonArticlesByScan,
  getJsonCatalog,
  getJsonScan,
  getJsonScans,
  searchJsonArticles,
} from "@/lib/catalog-json";
import {
  getTrackedAccountBySlug,
  listTrackedAccounts,
} from "@/lib/accounts-api";

export type { TrackedAccount } from "@/lib/accounts-types";

async function withDb<T>(
  fromDb: (db: NonNullable<Awaited<ReturnType<typeof getDb>>>) => Promise<T>,
  fromJson: () => T,
): Promise<T> {
  const db = await getDb();
  if (db) {
    try {
      const scanProbe = await db
        .prepare("SELECT id FROM scans LIMIT 1")
        .first();
      if (scanProbe) {
        return await fromDb(db);
      }
    } catch {
      /* D1 未 migrate 或本地空库 */
    }
  }
  return fromJson();
}

export async function getCatalog(): Promise<Catalog> {
  return withDb(loadCatalogFromDb, getJsonCatalog);
}

export async function getScans(): Promise<Scan[]> {
  return withDb(getScansFromDb, getJsonScans);
}

export async function getScan(scanId: string): Promise<Scan | undefined> {
  return withDb(
    (db) => getScanFromDb(db, scanId),
    () => getJsonScan(scanId),
  );
}

export async function getArticlesByScan(scanId: string): Promise<Article[]> {
  return withDb(
    (db) => getArticlesByScanFromDb(db, scanId),
    () => getJsonArticlesByScan(scanId),
  );
}

export async function getAllArticles(): Promise<Article[]> {
  return withDb(getAllArticlesFromDb, getJsonAllArticles);
}

export async function getArticle(
  id: string | undefined,
): Promise<Article | undefined> {
  if (!id) return undefined;
  return withDb(
    (db) => getArticleFromDb(db, id),
    () => getJsonArticle(id),
  );
}

export async function searchArticles(query: string): Promise<Article[]> {
  return withDb(
    (db) => searchArticlesInDb(db, query),
    () => searchJsonArticles(query),
  );
}

export async function getQueriesForScan(scanId: string): Promise<string[]> {
  const seen = new Set<string>();
  for (const article of await getArticlesByScan(scanId)) {
    if (article.query) seen.add(article.query);
  }
  return [...seen];
}

export async function getArticlesByAccountName(
  accountName: string,
): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((article) => article.account === accountName);
}

export async function getTrackedAccounts() {
  return listTrackedAccounts();
}

export async function getTrackedAccount(slug: string) {
  return getTrackedAccountBySlug(slug);
}

export async function getArticlesByAccountSlug(
  slug: string,
): Promise<Article[]> {
  const account = await getTrackedAccountBySlug(slug);
  if (!account) return [];
  return getArticlesByAccountName(account.name);
}
