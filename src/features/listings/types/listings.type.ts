export interface ListingImage {
  id: string;
  url: string;
  thumb_url: string;
  order: number;
}

export interface ListingImageShort {
  url: string;
  thumb_url: string;
}

export interface ListingShort {
  id: string;
  title: string;
  price: string;
  city: string;
  is_promoted: boolean;
  views: number;
  images: ListingImageShort[];
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  price: string;
  city: string;
  status: "active" | "sold" | "archived";
  is_promoted: boolean;
  promoted_until: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  images: ListingImage[];
}

export interface ListingFilters {
  q?: string;
  category?: string;
  city?: string;
  price_min?: string;
  price_max?: string;
  sort?: "created_at" | "-created_at" | "price" | "-price";
  page?: number;
  per_page?: number;
}

export interface CreateListingDTO {
  title: string;
  description: string;
  price: string;
  category_id: string;
  city: string;
}

export type UpdateListingDTO = Partial<CreateListingDTO> & {
  status?: "active" | "sold" | "archived";
};
