import catalogJson from "@/data/index.json";
import type { Article, Catalog, Scan } from "@/lib/types";
import {
  isPublishableArticle,
  withPublishableLink,
} from "@/lib/articles";

const catalog = catalogJson as Catalog;

const publishableArticles = catalog.articles
  .filter(isPublishableArticle)
  .map(withPublishableLink);

export function getCatalog(): Catalog {
  return {
    ...catalog,
    articles: publishableArticles,
    scans: catalog.scans.map((scan) => ({
      ...scan,
      articleCount: publishableArticles.filter(
        (article) => article.scanDate === scan.date,
      ).length,
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
  return publishableArticles.filter((article) => article.scanDate === scan.date);
}

export function getAllPublishableArticles(): Article[] {
  return publishableArticles;
}

export function getArticle(id: string | undefined): Article | undefined {
  if (!id) return undefined;
  return publishableArticles.find((article) => article.id === id);
}

export function searchPublishableArticles(query: string): Article[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return publishableArticles;
  return publishableArticles.filter((article) => {
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
