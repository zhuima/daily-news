"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArticleList } from "@/components/ArticleList";
import { FilterBar } from "@/components/FilterBar";
import { ReadingPanel } from "@/components/ReadingPanel";
import type { Article, Scan } from "@/lib/types";
import { formatScanDate, sourceLabel } from "@/lib/format";
import { useFilters } from "@/store/filters";

export function ScanWorkspace({
  scan,
  articles,
  queries,
  selectedId,
  selectedArticle,
  initialQuery = "",
}: {
  scan: Scan;
  articles: Article[];
  queries: string[];
  selectedId?: string;
  selectedArticle?: Article;
  initialQuery?: string;
}) {
  const query = useFilters((s) => s.query);
  const search = useFilters((s) => s.search);
  const sort = useFilters((s) => s.sort);
  const reset = useFilters((s) => s.reset);
  const setQuery = useFilters((s) => s.setQuery);

  useEffect(() => {
    reset();
    if (initialQuery.trim()) {
      setQuery(initialQuery.trim());
    }
  }, [scan.id, reset, initialQuery, setQuery]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = articles.filter((article) => {
      if (query && article.query !== query) return false;
      if (!needle) return true;
      const haystack =
        `${article.title} ${article.account} ${article.summary} ${article.publishedLabel}`.toLowerCase();
      return haystack.includes(needle);
    });
    if (sort === "score-desc") {
      return [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }
    return filtered;
  }, [articles, query, search, sort]);

  const closeHref = `/scans/${scan.id}`;

  return (
    <div className="docs-container flex flex-1 flex-col pt-4 pb-12 sm:pt-6 sm:pb-16">
      <header className="max-w-[40rem]">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-ink sm:text-[2rem]">
          {scan.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {formatScanDate(scan.date)}
          <span className="mx-2 text-line">·</span>
          {sourceLabel(scan.sources)}
          <span className="mx-2 text-line">·</span>
          <span className="tabular-nums">
            当前显示 {visible.length} / {scan.articleCount} 篇
          </span>
        </p>
        {scan.notes ? (
          <p className="mt-3 text-sm leading-7 text-muted">{scan.notes}</p>
        ) : null}
      </header>

      <div className="mt-6">
        <FilterBar queries={queries} />
      </div>

      <div className="mt-6 grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        <section>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 className="text-[13px] font-medium text-ink">文章列表</h2>
            <p className="text-[12px] tabular-nums text-muted">
              {visible.length} / {articles.length}
            </p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto border-t border-line lg:max-h-[calc(100vh-16rem)]">
            <ArticleList
              articles={visible}
              scanId={scan.id}
              selectedId={selectedId}
            />
          </div>
        </section>

        <aside className="hidden min-h-[28rem] border-l border-line pl-8 lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <ReadingPanel
            article={selectedArticle}
            scanId={scan.id}
            closeHref={closeHref}
          />
        </aside>
      </div>

      {selectedArticle ? (
        <div className="lg:hidden">
          <Link
            href={closeHref}
            scroll={false}
            className="fixed inset-0 z-50 bg-ink/35"
            aria-label="关闭阅读面板"
            data-sheet-backdrop="true"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-y-auto rounded-t-xl border-t border-line bg-paper">
            <div className="flex justify-center pt-3" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-line" />
            </div>
            <ReadingPanel
              article={selectedArticle}
              scanId={scan.id}
              closeHref={closeHref}
              variant="sheet"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
