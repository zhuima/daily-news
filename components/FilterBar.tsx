"use client";

import { useFilters } from "@/store/filters";

export function FilterBar({ queries }: { queries: string[] }) {
  const query = useFilters((s) => s.query);
  const search = useFilters((s) => s.search);
  const setQuery = useFilters((s) => s.setQuery);
  const setSearch = useFilters((s) => s.setSearch);
  const sort = useFilters((s) => s.sort);
  const setSort = useFilters((s) => s.setSort);

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-ink">关键词搜索</span>
        <span className="mt-1 block text-sm text-muted">
          在当前扫描内搜索标题、公众号或摘要
        </span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="输入关键词，例如 Serving、MFU、评测"
          className="field mt-3"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] font-medium text-muted">检索词</span>
        <QueryChip
          active={query === ""}
          onClick={() => setQuery("")}
          label="全部"
        />
        {queries.map((item) => (
          <QueryChip
            key={item}
            active={query === item}
            onClick={() => setQuery(item)}
            label={item}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
        <span className="mr-1 text-[13px] font-medium text-muted">排序</span>
        <QueryChip
          active={sort === "default"}
          onClick={() => setSort("default")}
          label="目录顺序"
        />
        <QueryChip
          active={sort === "score-desc"}
          onClick={() => setSort("score-desc")}
          label="质量分 ↓"
        />
      </div>
    </div>
  );
}

function QueryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip ${active ? "chip-active" : ""}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
