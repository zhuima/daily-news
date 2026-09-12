import { create } from "zustand";

export type FiltersState = {
  query: string;
  hasDirectLinkOnly: boolean;
  search: string;
  setQuery: (query: string) => void;
  setHasDirectLinkOnly: (hasDirectLinkOnly: boolean) => void;
  setSearch: (search: string) => void;
  reset: () => void;
};

const initialFilters = {
  query: "",
  hasDirectLinkOnly: false,
  search: "",
};

export const useFilters = create<FiltersState>((set) => ({
  ...initialFilters,
  setQuery: (query) => set({ query }),
  setHasDirectLinkOnly: (hasDirectLinkOnly) => set({ hasDirectLinkOnly }),
  setSearch: (search) => set({ search }),
  reset: () => set(initialFilters),
}));
