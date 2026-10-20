import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  setIds: (ids: string[]) => void;
  addId: (id: string) => void;
  removeId: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      setIds: (ids) => set({ ids }),
      addId: (id) =>
        set((state) =>
          state.ids.includes(id) ? state : { ids: [...state.ids, id] },
        ),
      removeId: (id) =>
        set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      isFavorite: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "favorites" },
  ),
);
