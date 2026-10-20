import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as profileApi from "../api/profile.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import type { UpdateProfileDTO } from "../types/profile.type";

// =========================
// ME — мой профиль
// =========================
export function useProfile() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: profileApi.getMe,
    staleTime: 5 * 60 * 1000,
  });
}

// =========================
// UPDATE ME — обновить профиль
// =========================
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDTO) => profileApi.updateMe(dto),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["auth", "me"], user);
      toast.success("Профиль обновлён");
    },
    onError: () => {
      toast.error("Не удалось обновить профиль");
    },
  });
}

// =========================
// PUBLIC USER — публичный профиль
// =========================
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => profileApi.getUser(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// =========================
// USER LISTINGS — объявления автора
// =========================
export function useUserListings(id: string | undefined) {
  return useQuery({
    queryKey: ["users", id, "listings"],
    queryFn: () => profileApi.getUserListings(id!),
    enabled: !!id,
  });
}
