import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import { useToggleFavorite, useFavoritesStore } from "@/features/favorites";

interface Props {
  listingId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: { btn: "w-8 h-8", icon: "w-4 h-4" },
  md: { btn: "w-9 h-9", icon: "w-5 h-5" },
  lg: { btn: "w-11 h-11", icon: "w-6 h-6" },
};

export function FavoriteButton({ listingId, className, size = "md" }: Props) {
  const isFav = useFavoritesStore((s) => s.ids.includes(listingId));
  const toggle = useToggleFavorite();
  const s = SIZE[size];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle.mutate(listingId);
      }}
      disabled={toggle.isPending}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white hover:shadow transition active:scale-90",
        s.btn,
        className,
      )}
      aria-label={isFav ? "Убрать из избранного" : "В избранное"}
      aria-pressed={isFav}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isFav ? "on" : "off"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          <Heart
            className={cn(
              "transition-colors",
              s.icon,
              isFav ? "fill-red-500 text-red-500" : "text-gray-600",
            )}
          />
        </motion.span>
      </AnimatePresence>

      {/* Микро-вспышка при добавлении */}
      {isFav && (
        <motion.span
          key="pulse"
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 rounded-full bg-red-500/40"
        />
      )}
    </button>
  );
}
