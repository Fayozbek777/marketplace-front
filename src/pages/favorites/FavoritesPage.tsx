import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "@/features/favorites";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Heart, MapPin, Eye, ImageOff, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites();
  const count = data?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Избранное
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading
            ? "Загрузка…"
            : count === 0
              ? "Здесь появятся объявления, которые вам понравились"
              : `Сохранено: ${count} ${
                  count === 1
                    ? "объявление"
                    : count < 5
                      ? "объявления"
                      : "объявлений"
                }`}
        </p>
      </div>

      {/* Скелетоны */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пусто */}
      {!isLoading && (!data || data.length === 0) && (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="Пока пусто"
          description="Нажимайте на сердечко у объявлений — они появятся здесь"
          action={
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition"
            >
              Смотреть объявления
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      )}

      {/* Сетка */}
      {!isLoading && data && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((l, i) => {
            const image = l.images?.[0];
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              >
                <Link
                  to={`/listings/${l.id}`}
                  className="group block border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-brand-400 hover:shadow-lg transition"
                >
                  {/* Фото */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {image?.thumb_url ? (
                      <img
                        src={image.thumb_url}
                        alt={l.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1">
                        <ImageOff className="w-8 h-8" />
                        <span className="text-[11px]">Нет фото</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur text-red-500 flex items-center justify-center shadow-sm">
                      <Heart className="w-3.5 h-3.5 fill-red-500" />
                    </span>
                  </div>

                  {/* Инфо */}
                  <div className="p-3 space-y-1">
                    <div className="font-bold text-lg text-gray-900">
                      {formatPrice(l.price)}
                    </div>
                    <div className="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
                      {l.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{l.city}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Eye className="w-3 h-3" />
                        {l.views}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatRelative(l.created_at)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
