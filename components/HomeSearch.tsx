"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArticleEngagement } from "@/components/ArticleEngagement";
import { ArticleScoreChip } from "@/components/ArticleScoreChip";
import type { Article } from "@/lib/types";

export function HomeSearch({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return articles
      .filter((article) => {
        const haystack =
          `${article.title} ${article.account} ${article.summary} ${article.query}`.toLowerCase();
        return haystack.includes(needle);
      })
      .slice(0, 12);
  }, [articles, query]);

  return (
    <div className="rounded-sm bg-paper p-6 ring-1 ring-line sm:p-8">
      <label className="block">
        <span className="text-sm font-medium text-ink">全站搜索</span>
        <span className="mt-1 block text-sm text-muted">
          搜索标题、公众号、摘要或检索词
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：vLLM、水金聊投资、算力成本"
          className="mt-4 h-12 w-full rounded-sm border border-line bg-canvas px-4 text-sm outline-none transition focus:border-marrs focus:ring-2 focus:ring-marrs/20"
        />
      </label>
      {query.trim() ? (
        <div className="mt-5 border-t border-line pt-5">
          {results.length === 0 ? (
            <p className="text-sm text-muted">没有匹配的文章。</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/scans/${article.scanDate}?article=${encodeURIComponent(article.id)}`}
                    className="flex items-start justify-between gap-3 py-3 transition-colors hover:text-marrs"
                  >
                    <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-6 text-ink">{article.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {article.account}
                      <span className="mx-1.5">·</span>
                      {article.publishedLabel}
                      <span className="mx-1.5">·</span>
                      {article.query}
                    </p>
                    <ArticleEngagement article={article} className="mt-1" />
                    </div>
                    <ArticleScoreChip article={article} className="shrink-0 pt-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
