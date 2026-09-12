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
}: {
  scan: Scan;
  articles: Article[];
  queries: string[];
  selectedId?: string;
  selectedArticle?: Article;
}) {
  const query = useFilters((s) => s.query);
  const search = useFilters((s) => s.search);
  const reset = useFilters((s) => s.reset);

  useEffect(() => {
    reset();
  }, [scan.id, reset]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (query && article.query !== query) return false;
      if (!needle) return true;
      const haystack =
        `${article.title} ${article.account} ${article.summary} ${article.publishedLabel}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, query, search]);

  const closeHref = `/scans/${scan.id}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10">
      <header className="max-w-3xl">
        <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
          {formatScanDate(scan.date)}
        </p>
        <h1 className="mt-3 text-3xl tracking-tight text-ink sm:text-4xl">
          {scan.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {sourceLabel(scan.sources)}
          <span className="mx-2">·</span>
          {scan.articleCount} 篇
          <span className="mx-2">·</span>
          当前显示 {visible.length} 篇
        </p>
        {scan.notes ? (
          <p className="mt-4 text-sm leading-7 text-ink/75">{scan.notes}</p>
        ) : null}
      </header>

      <div className="mt-8">
        <FilterBar queries={queries} />
      </div>

      <div className="mt-6 grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <section className="overflow-hidden rounded-sm bg-paper ring-1 ring-line">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="text-sm text-ink">文章列表</h2>
            <p className="text-xs text-muted">
              {visible.length} / {articles.length}
            </p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto lg:max-h-[calc(100vh-16rem)]">
            <ArticleList
              articles={visible}
              scanId={scan.id}
              selectedId={selectedId}
            />
          </div>
        </section>

        <aside className="hidden min-h-[32rem] overflow-hidden rounded-sm bg-paper ring-1 ring-line lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
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
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-paper shadow-[0_-12px_40px_-12px_rgba(28,27,25,0.25)]">
            <ReadingPanel
              article={selectedArticle}
              scanId={scan.id}
              closeHref={closeHref}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
