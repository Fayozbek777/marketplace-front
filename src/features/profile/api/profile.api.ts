import { apiClient } from "@/shared/api/client";
import { endpoints } from "@/shared/api/endpoints";
import type { User } from "@/features/auth/types/auth.type";
import type {
  PublicUser,
  UpdateProfileDTO,
  UserListingShort,
} from "../types/profile.type";

/** GET /users/me — мой профиль  */
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>(endpoints.users.me);
  return data;
}

/** PATCH /users/me/update — частичное обновление (Bearer) */
export async function updateMe(dto: UpdateProfileDTO): Promise<User> {
  const { data } = await apiClient.patch<User>(endpoints.users.update, dto);
  return data;
}

/** GET /users/{id} — публичный профиль (без auth) */
export async function getUser(id: string): Promise<PublicUser> {
  const { data } = await apiClient.get<PublicUser>(endpoints.users.byId(id));
  return data;
}

/** GET /users/{id}/listings — объявления пользователя (без auth, до 50) */
export async function getUserListings(id: string): Promise<UserListingShort[]> {
  const { data } = await apiClient.get<UserListingShort[]>(
    endpoints.users.listings(id),
  );
  return data;
}
