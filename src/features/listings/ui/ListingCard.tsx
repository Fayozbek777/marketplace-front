import { Link } from "react-router-dom";
import { Eye, MapPin } from "lucide-react";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { FavoriteButton } from "@/features/favorites";
import type { ListingShort } from "../types/listings.type";

interface Props {
  listing: ListingShort;
}

export function ListingCard({ listing }: Props) {
  const image = listing.images[0];

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block border rounded-lg overflow-hidden bg-white hover:shadow-md transition group"
    >
      {/* Фото */}
      <div className="relative aspect-square bg-gray-100">
        {image ? (
          <img
            src={image.thumb_url}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Нет фото
          </div>
        )}

        {listing.is_promoted && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs bg-yellow-400 text-black rounded">
            ТОП
          </span>
        )}

        <FavoriteButton
          listingId={listing.id}
          className="absolute top-2 right-2"
        />
      </div>

      {/* Инфо */}
      <div className="p-3 space-y-1">
        <div className="font-bold text-lg">{formatPrice(listing.price)}</div>
        <div className="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
          {listing.title}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.city}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {listing.views}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          {formatRelative(listing.created_at)}
        </div>
      </div>
    </Link>
  );
}
