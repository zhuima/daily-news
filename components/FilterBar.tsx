"use client";

import { useFilters } from "@/store/filters";

export function FilterBar({ queries }: { queries: string[] }) {
  const query = useFilters((s) => s.query);
  const hasDirectLinkOnly = useFilters((s) => s.hasDirectLinkOnly);
  const search = useFilters((s) => s.search);
  const setQuery = useFilters((s) => s.setQuery);
  const setHasDirectLinkOnly = useFilters((s) => s.setHasDirectLinkOnly);
  const setSearch = useFilters((s) => s.setSearch);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">搜索标题、账号或摘要</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索标题、账号或摘要"
          className="h-11 w-full rounded-sm border border-line bg-paper px-4 text-sm outline-none ring-marrs/0 transition focus:border-marrs focus:ring-2 focus:ring-marrs/20"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <QueryChip
          active={query === ""}
          onClick={() => setQuery("")}
          label="全部关键词"
        />
        {queries.map((item) => (
          <QueryChip
            key={item}
            active={query === item}
            onClick={() => setQuery(item)}
            label={item}
          />
        ))}
        <button
          type="button"
          onClick={() => setHasDirectLinkOnly(!hasDirectLinkOnly)}
          className={`ml-auto inline-flex h-9 items-center gap-2 rounded-sm border px-3 text-xs tracking-wide transition-colors ${
            hasDirectLinkOnly
              ? "border-marrs bg-marrs text-white"
              : "border-line bg-paper text-muted hover:border-marrs/40 hover:text-marrs"
          }`}
          aria-pressed={hasDirectLinkOnly}
        >
          仅看可打开原文
        </button>
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
      className={`h-9 rounded-sm border px-3 text-xs tracking-wide transition-colors ${
        active
          ? "border-marrs bg-marrs text-white"
          : "border-line bg-paper text-muted hover:border-marrs/40 hover:text-marrs"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
