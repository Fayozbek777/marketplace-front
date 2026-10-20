import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as favoritesApi from "../api/favorites.api";
import { useFavoritesStore } from "./favorites.store";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function useFavorites() {
  const setIds = useFavoritesStore((s) => s.setIds);
  const isAuth = useAuthStore((s) => s.isAuthenticated);

  const query = useQuery({
    queryKey: ["favorites"],
    queryFn: favoritesApi.getFavorites,
    enabled: isAuth,
  });

  // синхронизация ids в store — ВНЕ рендера
  useEffect(() => {
    if (query.data) {
      setIds(query.data.map((x) => x.id));
    }
  }, [query.data, setIds]);

  return query;
}

export function useFavoritesCount() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["favorites", "count"],
    queryFn: favoritesApi.getFavoritesCount,
    enabled: isAuth,
    staleTime: 60 * 1000,
  });
}

export function useToggleFavorite() {
  const ids = useFavoritesStore((s) => s.ids);
  const addId = useFavoritesStore((s) => s.addId);
  const removeId = useFavoritesStore((s) => s.removeId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const wasFav = ids.includes(id);
      if (wasFav) await favoritesApi.removeFavorite(id);
      else await favoritesApi.addFavorite(id);
      return { id, wasFav };
    },
    onMutate: (id) => {
      const wasFav = ids.includes(id);
      if (wasFav) removeId(id);
      else addId(id);
      return { wasFav };
    },
    onError: (_err, id, ctx) => {
      if (ctx?.wasFav) addId(id);
      else removeId(id);
      toast.error("Не удалось обновить избранное");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "count"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
