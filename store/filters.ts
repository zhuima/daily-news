import { create } from "zustand";

export type FiltersState = {
  query: string;
  search: string;
  setQuery: (query: string) => void;
  setSearch: (search: string) => void;
  reset: () => void;
};

const initialFilters = {
  query: "",
  search: "",
};

export const useFilters = create<FiltersState>((set) => ({
  ...initialFilters,
  setQuery: (query) => set({ query }),
  setSearch: (search) => set({ search }),
  reset: () => set(initialFilters),
}));
