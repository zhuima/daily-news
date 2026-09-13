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
    <div className="surface-inset px-6 py-7 sm:px-8 sm:py-8">
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
          className="field mt-4 h-12 bg-paper"
        />
      </label>
      {query.trim() ? (
        <div className="mt-6 border-t border-line pt-5">
          {results.length === 0 ? (
            <p className="text-sm leading-7 text-muted">
              没有匹配的文章。换一个公众号名、检索词或标题片段再试。
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/scans/${article.scanDate}?article=${encodeURIComponent(article.id)}`}
                    className="interactive focus-ring flex items-start justify-between gap-3 py-3.5 hover:text-marrs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] leading-6 font-medium text-ink">
                        {article.title}
                      </p>
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
