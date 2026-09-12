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
      <div className="px-6 py-16 text-center text-sm leading-7 text-muted">
        没有符合当前筛选的文章。试试清空关键词或关闭「仅看可打开原文」。
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
