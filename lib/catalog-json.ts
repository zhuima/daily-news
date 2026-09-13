import catalogJson from "@/data/index.json";
import type { Article, Catalog, Scan } from "@/lib/types";
import { normalizeArticle } from "@/lib/articles";

const catalog = catalogJson as Catalog;
const articles = catalog.articles.map(normalizeArticle);

export function getJsonCatalog(): Catalog {
  return {
    ...catalog,
    articles,
    scans: catalog.scans.map((scan) => ({
      ...scan,
      articleCount: articles.filter((a) => a.scanDate === scan.date).length,
    })),
  };
}

export function getJsonScans(): Scan[] {
  return [...getJsonCatalog().scans].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getJsonScan(scanId: string): Scan | undefined {
  return getJsonCatalog().scans.find((s) => s.id === scanId);
}

export function getJsonArticlesByScan(scanId: string): Article[] {
  const scan = getJsonScan(scanId);
  if (!scan) return [];
  return articles.filter((a) => a.scanDate === scan.date);
}

export function getJsonAllArticles(): Article[] {
  return articles;
}

export function getJsonArticle(id: string | undefined): Article | undefined {
  if (!id) return undefined;
  return articles.find((a) => a.id === id);
}

export function searchJsonArticles(query: string): Article[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return articles;
  return articles.filter((article) => {
    const haystack =
      `${article.title} ${article.account} ${article.summary} ${article.query} ${article.publishedLabel}`.toLowerCase();
    return haystack.includes(needle);
  });
}
