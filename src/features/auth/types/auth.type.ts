import type { Id } from "@/shared/types/common.type";

export interface User {
  id: Id;
  email: string;
  name: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_admin: number;
  is_verified: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface LogoutRequest {
  refresh: string;
}
