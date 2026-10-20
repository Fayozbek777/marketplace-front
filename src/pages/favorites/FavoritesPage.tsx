import { Link } from "react-router-dom";
import { useFavorites } from "@/features/favorites";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Heart, MapPin, Eye } from "lucide-react";

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Избранное</h1>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="Пусто"
          description="Добавляйте объявления в избранное"
          action={
            <Link
              to="/listings"
              className="px-4 py-2 bg-brand-600 text-white rounded-lg"
            >
              Смотреть объявления
            </Link>
          }
        />
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((l) => (
            <Link
              key={l.id}
              to={`/listings/${l.id}`}
              className="border rounded-lg overflow-hidden hover:shadow bg-white"
            >
              <div className="p-3 space-y-1">
                <div className="font-bold text-lg">{formatPrice(l.price)}</div>
                <div className="text-sm line-clamp-2">{l.title}</div>
                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {l.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {l.views}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {formatRelative(l.created_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
