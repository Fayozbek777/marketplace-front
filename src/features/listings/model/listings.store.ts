import { create } from "zustand";
import type { ListingFilters } from "../types/listings.type";

interface ListingsState {
  filters: ListingFilters;
  setFilter: <K extends keyof ListingFilters>(
    key: K,
    value: ListingFilters[K],
  ) => void;
  setFilters: (filters: ListingFilters) => void;
  resetFilters: () => void;
}

const initialFilters: ListingFilters = {
  page: 1,
  per_page: 12,
  sort: "-created_at",
};

export const useListingsStore = create<ListingsState>()((set) => ({
  filters: initialFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 }, // сброс на 1-ю страницу
    })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: initialFilters }),
}));
