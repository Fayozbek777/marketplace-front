import { apiClient } from "@/shared/api/client";
import { endpoints } from "@/shared/api/endpoints";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  User,
} from "../types/auth.type";

export async function login(dto: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    endpoints.auth.login,
    dto,
  );
  return data;
}

export async function register(dto: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    endpoints.auth.register,
    dto,
  );
  return data;
}

export async function logout(dto: LogoutRequest): Promise<void> {
  await apiClient.post(endpoints.auth.logout, dto);
}

export async function refresh(dto: RefreshRequest): Promise<RefreshResponse> {
  const { data } = await apiClient.post<RefreshResponse>(
    endpoints.auth.refresh,
    dto,
  );
  return data;
}

export async function me(): Promise<User> {
  const { data } = await apiClient.get<User>(endpoints.auth.me);
  return data;
}
