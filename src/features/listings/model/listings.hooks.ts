import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import * as listingsApi from "../api/listings.api";
import { useListingsStore } from "./listings.store";
import type {
  ListingFilters,
  CreateListingDTO,
  UpdateListingDTO,
} from "../types/listings.type";
import { useAuthStore } from "@/features/auth";

// =========================
// LIST — каталог (с фильтрами)
// =========================
export function useListings(override?: ListingFilters) {
  const filters = useListingsStore((s) => s.filters);
  const merged = { ...filters, ...override };

  return useQuery({
    queryKey: ["listings", merged],
    queryFn: () => listingsApi.getListings(merged),
    placeholderData: (prev) => prev, // не мигать при смене страницы
  });
}

// =========================
// DETAIL — одно объявление
// =========================
export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ["listings", id],
    queryFn: () => listingsApi.getListing(id!),
    enabled: !!id,
  });
}

// =========================
// MY — мои объявления
// =========================
export function useMyListings() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["listings", "my"],
    queryFn: listingsApi.getMyListings,
    enabled: isAuth,
    // если бэкенд вернёт {items: [...]} — разворачиваем
    select: (data: any) => {
      if (Array.isArray(data)) return data;
      if (data?.items) return data.items;
      if (data?.listings) return data.listings;
      return [];
    },
  });
}

// =========================
// CREATE
// =========================
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateListingDTO) => listingsApi.createListing(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Объявление создано");
    },
    onError: () => toast.error("Не удалось создать объявление"),
  });
}

// =========================
// UPDATE
// =========================
export function useUpdateListing(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateListingDTO) => listingsApi.updateListing(id, dto),
    onSuccess: (data) => {
      queryClient.setQueryData(["listings", id], data);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Объявление обновлено");
    },
    onError: () => toast.error("Не удалось обновить"),
  });
}

// =========================
// DELETE
// =========================
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingsApi.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Объявление удалено");
    },
    onError: () => toast.error("Не удалось удалить"),
  });
}

// =========================
// VIEW — инкремент просмотров при открытии карточки
// =========================
export function useTrackView(listingId: string | undefined) {
  useEffect(() => {
    if (!listingId) return;
    listingsApi.viewListing(listingId).catch(() => {
      // тихо — просмотры не критичны
    });
  }, [listingId]);
}
