import catalogJson from "@/data/index.json";
import type { Article, Catalog, Scan } from "@/lib/types";
import { normalizeArticle } from "@/lib/articles";
import {
  getTrackedAccountBySlug,
  listTrackedAccounts,
} from "@/lib/accounts-api";

export type { TrackedAccount } from "@/lib/accounts-types";

const catalog = catalogJson as Catalog;

const articles = catalog.articles.map(normalizeArticle);

export function getCatalog(): Catalog {
  return {
    ...catalog,
    articles,
    scans: catalog.scans.map((scan) => ({
      ...scan,
      articleCount: articles.filter((article) => article.scanDate === scan.date)
        .length,
    })),
  };
}

export function getScans(): Scan[] {
  return [...getCatalog().scans].sort((a, b) => b.date.localeCompare(a.date));
}

export function getScan(scanId: string): Scan | undefined {
  return getCatalog().scans.find((scan) => scan.id === scanId);
}

export function getArticlesByScan(scanId: string): Article[] {
  const scan = getScan(scanId);
  if (!scan) return [];
  return articles.filter((article) => article.scanDate === scan.date);
}

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticle(id: string | undefined): Article | undefined {
  if (!id) return undefined;
  return articles.find((article) => article.id === id);
}

export function searchArticles(query: string): Article[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return articles;
  return articles.filter((article) => {
    const haystack =
      `${article.title} ${article.account} ${article.summary} ${article.query} ${article.publishedLabel}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function getQueriesForScan(scanId: string): string[] {
  const seen = new Set<string>();
  for (const article of getArticlesByScan(scanId)) {
    if (article.query) seen.add(article.query);
  }
  return [...seen];
}

export function getArticlesByAccountName(accountName: string): Article[] {
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
