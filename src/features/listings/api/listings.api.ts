import { apiClient } from "@/shared/api/client";
import { endpoints } from "@/shared/api/endpoints";
import type { Paginated } from "@/shared/types/common.type";
import type {
  Listing,
  ListingShort,
  ListingFilters,
  CreateListingDTO,
  UpdateListingDTO,
} from "../types/listings.type";

/** GET /listings/ — каталог с фильтрами и пагинацией */
export async function getListings(
  filters: ListingFilters = {},
): Promise<Paginated<ListingShort>> {
  const { data } = await apiClient.get<Paginated<ListingShort>>(
    endpoints.listings.list,
    { params: filters },
  );
  return data;
}

/** GET /listings/{id} — детально */
export async function getListing(id: string): Promise<Listing> {
  const { data } = await apiClient.get<Listing>(endpoints.listings.byId(id));
  return data;
}

/** POST /listings/create — создать */
export async function createListing(dto: CreateListingDTO): Promise<Listing> {
  const { data } = await apiClient.post<Listing>(
    endpoints.listings.create,
    dto,
  );
  return data;
}

/** PATCH /listings/{id}/edit — обновить */
export async function updateListing(
  id: string,
  dto: UpdateListingDTO,
): Promise<Listing> {
  const { data } = await apiClient.patch<Listing>(
    endpoints.listings.update(id),
    dto,
  );
  return data;
}

/** DELETE /listings/{id}/delete — soft delete */
export async function deleteListing(id: string): Promise<void> {
  await apiClient.delete(endpoints.listings.delete(id));
}

/** GET /listings/my — мои объявления */
export async function getMyListings(): Promise<Listing[]> {
  const { data } = await apiClient.get<Listing[]>(endpoints.listings.my);
  return data;
}

/** POST /listings/{id}/view — инкремент просмотров (public) */
export async function viewListing(id: string): Promise<void> {
  await apiClient.post(endpoints.listings.view(id));
}
