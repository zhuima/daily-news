import { create } from "zustand";

export type ArticleSort = "default" | "score-desc";

export type FiltersState = {
  query: string;
  search: string;
  sort: ArticleSort;
  setQuery: (query: string) => void;
  setSearch: (search: string) => void;
  setSort: (sort: ArticleSort) => void;
  reset: () => void;
};

const initialFilters = {
  query: "",
  search: "",
  sort: "default" as ArticleSort,
};

export const useFilters = create<FiltersState>((set) => ({
  ...initialFilters,
  setQuery: (query) => set({ query }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ ...initialFilters }),
}));
