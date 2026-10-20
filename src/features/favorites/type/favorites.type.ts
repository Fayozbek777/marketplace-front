export interface FavoriteListing {
  id: string;
  title: string;
  description: string;
  price: string;
  city: string;
  status: string;
  is_promoted: boolean;
  promoted_until: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface FavoritesCount {
  count: number;
}
