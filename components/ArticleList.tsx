import { ArticleRow } from "@/components/ArticleRow";
import type { Article } from "@/lib/types";

export function ArticleList({
  articles,
  scanId,
  selectedId,
}: {
  articles: Article[];
  scanId: string;
  selectedId?: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="py-16">
        <p className="text-sm font-medium text-ink">没有匹配条目</p>
        <p className="mt-2 max-w-[36ch] text-sm leading-7 text-muted">
          当前筛选下没有文章。清空关键词，或把检索词改回「全部」。
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleRow
            article={article}
            scanId={scanId}
            selected={article.id === selectedId}
          />
        </li>
      ))}
    </ul>
  );
}
