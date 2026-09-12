import { isAllowedArticleUrl } from "@/lib/articles";
import type { Article, Scan } from "@/lib/types";

export function countByQuery(articles: Article[]): { query: string; count: number }[] {
  const map = new Map<string, number>();
  for (const article of articles) {
    map.set(article.query, (map.get(article.query) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count);
}

export function featuredLinkedArticle(articles: Article[]): Article | undefined {
  return articles.find((article) => isAllowedArticleUrl(article.url));
}

export function scanSummary(scan: Scan, articles: Article[]) {
  const inScan = articles.filter((a) => a.scanDate === scan.date);
  return {
    total: inScan.length,
    linked: inScan.filter((a) => isAllowedArticleUrl(a.url)).length,
    queries: countByQuery(inScan).length,
  };
}
