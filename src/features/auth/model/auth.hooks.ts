import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "./auth.store";
import * as authApi from "../api/auth.api";
import { getTokens } from "@/shared/api/interceptors";
import type { LoginRequest, RegisterRequest } from "../types/auth.type";

// LOGIN
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginRequest) => authApi.login(dto),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success(`Добро пожаловать, ${data.user.name}`);
    },
    onError: () => {
      toast.error("Неверный email или пароль");
    },
  });
}

// REGISTER
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterRequest) => authApi.register(dto),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Аккаунт создан");
    },
    onError: () => {
      toast.error("Не удалось зарегистрироваться");
    },
  });
}

// LOGOUT
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const tokens = getTokens();
      if (tokens?.refresh) {
        try {
          await authApi.logout({ refresh: tokens.refresh });
        } catch {
          // fuck you
        }
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Вы вышли");
    },
    onError: () => {
      logout();
      queryClient.clear();
    },
  });
}

// ME
export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      setUser(data);
      return data;
    },
  });
}
