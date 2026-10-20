import { apiClient } from "@/shared/api/client";
import { endpoints } from "@/shared/api/endpoints";
import type { FavoriteListing, FavoritesCount } from "../types/favorites.type";

export async function getFavorites(): Promise<FavoriteListing[]> {
  const { data } = await apiClient.get<FavoriteListing[]>(
    endpoints.favorites.list,
  );
  return data;
}

export async function addFavorite(id: string): Promise<void> {
  await apiClient.post(endpoints.favorites.add(id));
}

export async function removeFavorite(id: string): Promise<void> {
  await apiClient.delete(endpoints.favorites.remove(id));
}

export async function getFavoritesCount(): Promise<FavoritesCount> {
  const { data } = await apiClient.get<FavoritesCount>(
    endpoints.favorites.count,
  );
  return data;
}
