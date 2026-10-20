import { apiClient } from "@/shared/api/client";
import { endpoints } from "@/shared/api/endpoints";

export interface Category {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  children: Category[];
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>(endpoints.categories.list);
  return data;
}
