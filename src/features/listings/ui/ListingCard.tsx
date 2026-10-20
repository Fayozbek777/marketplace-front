import { Link } from "react-router-dom";
import { Eye, MapPin, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { FavoriteButton } from "@/features/favorites";
import { cn } from "@/shared/lib/cn";
import type { ListingShort } from "../types/listings.type";

interface Props {
  listing: ListingShort;
  /** Компактный режим — для горизонтальных списков */
  compact?: boolean;
}

export function ListingCard({ listing, compact = false }: Props) {
  const image = listing.images[0];
  const hasImage = Boolean(image?.thumb_url);

  return (
    <Link
      to={`/listings/${listing.id}`}
      className={cn(
        "group block bg-white border border-gray-200 rounded-xl overflow-hidden",
        "hover:border-brand-400 hover:shadow-lg transition",
        compact && "flex",
      )}
    >
      {/* Фото */}
      <div
        className={cn(
          "relative overflow-hidden bg-gray-100",
          compact ? "w-32 h-32 shrink-0" : "aspect-square",
        )}
      >
        {hasImage ? (
          <img
            src={image.thumb_url}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1">
            <ImageOff className="w-8 h-8" />
            <span className="text-[11px]">Нет фото</span>
          </div>
        )}

        {/* Бейдж ТОП */}
        {listing.is_promoted && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-amber-400 to-yellow-300 text-black rounded shadow-sm"
          >
            ★ ТОП
          </motion.span>
        )}

        {/* Избранное */}
        <FavoriteButton
          listingId={listing.id}
          className="absolute top-2 right-2"
        />

        {/* Время (поверх фото, снизу) */}
        {!compact && (
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[10px] font-medium text-white bg-black/50 rounded backdrop-blur-sm">
            {formatRelative(listing.created_at)}
          </span>
        )}
      </div>

      {/* Инфо */}
      <div className={cn("p-3 space-y-1", compact && "flex-1 min-w-0 py-2.5")}>
        <div
          className={cn(
            "font-bold text-gray-900",
            compact ? "text-base" : "text-lg",
          )}
        >
          {formatPrice(listing.price)}
        </div>
        <div
          className={cn(
            "text-sm text-gray-800 line-clamp-2",
            compact ? "min-h-0" : "min-h-[2.5rem]",
          )}
        >
          {listing.title}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{listing.city}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Eye className="w-3 h-3" />
            {listing.views}
          </span>
        </div>
        {compact && (
          <div className="text-[11px] text-gray-400">
            {formatRelative(listing.created_at)}
          </div>
        )}
      </div>
    </Link>
  );
}
