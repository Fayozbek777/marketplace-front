import { Heart } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useToggleFavorite, useFavoritesStore } from "@/features/favorites";

interface Props {
  listingId: string;
  className?: string;
}

export function FavoriteButton({ listingId, className }: Props) {
  const isFav = useFavoritesStore((s) => s.ids.includes(listingId));
  const toggle = useToggleFavorite();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); // не переходить по ссылке карточки
        e.stopPropagation();
        toggle.mutate(listingId);
      }}
      className={cn(
        "p-2 rounded-full bg-white/80 hover:bg-white transition",
        className,
      )}
      aria-label={isFav ? "Убрать из избранного" : "В избранное"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition",
          isFav ? "fill-red-500 text-red-500" : "text-gray-600",
        )}
      />
    </button>
  );
}
