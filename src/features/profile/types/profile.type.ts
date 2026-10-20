import type { User } from "@/features/auth/types/auth.type";

export interface PublicUser {
  id: string;
  name: string;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface UpdateProfileDTO {
  name?: string | null;
  phone?: string | null;
  city?: string | null;
  bio?: string | null;
}

export interface UserListingShort {
  id: string;
  title: string;
  price: string;
  city: string;
  is_promoted: boolean;
  views: number;
  images: Array<{ url: string; thumb_url: string }>;
  created_at: string;
}

export type MeProfile = User;
