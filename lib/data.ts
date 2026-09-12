import catalogJson from "@/data/index.json";
import type { Article, Catalog, Scan } from "@/lib/types";

const catalog = catalogJson as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getScans(): Scan[] {
  return [...catalog.scans].sort((a, b) => b.date.localeCompare(a.date));
}

export function getScan(scanId: string): Scan | undefined {
  return catalog.scans.find((scan) => scan.id === scanId);
}

export function getArticlesByScan(scanId: string): Article[] {
  const scan = getScan(scanId);
  if (!scan) return [];
  return catalog.articles.filter((article) => article.scanDate === scan.date);
}

export function getArticle(id: string | undefined): Article | undefined {
  if (!id) return undefined;
  return catalog.articles.find((article) => article.id === id);
}

export function getQueriesForScan(scanId: string): string[] {
  const seen = new Set<string>();
  for (const article of getArticlesByScan(scanId)) {
    if (article.query) seen.add(article.query);
  }
  return [...seen];
}
