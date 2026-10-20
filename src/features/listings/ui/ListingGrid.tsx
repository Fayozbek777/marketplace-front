import { useMemo, useState } from "react";
import { List, LayoutGrid, SearchX, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import type { ListingShort } from "../types/listings.type";
import { ListingCard } from "./ListingCard";
import { ListingSkeleton } from "./ListingSkeleton";
import { EmptyState } from "@/shared/ui/EmptyState";
import { cn } from "@/shared/lib/cn";

interface Props {
  listings: ListingShort[] | undefined;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Действие в EmptyState (напр. «Сбросить фильтры») */
  emptyAction?: React.ReactNode;
  /** Показывать переключатель сетка/список */
  showViewToggle?: boolean;
  /** Показывать количество */
  showCount?: boolean;
}

type View = "grid" | "list";

export function ListingGrid({
  listings,
  isLoading,
  emptyTitle,
  emptyDescription,
  emptyAction,
  showViewToggle = true,
  showCount = true,
}: Props) {
  const [view, setView] = useState<View>("grid");
  const count = listings?.length ?? 0;

  const containerClass = useMemo(
    () =>
      cn(
        "grid gap-4",
        view === "grid"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-1",
      ),
    [view],
  );

  // Скелетоны
  if (isLoading) {
    return (
      <div className={containerClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Пусто
  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "Объявлений пока нет"}
        description={
          emptyDescription ?? "Попробуйте изменить фильтры или зайти позже"
        }
        icon={<SearchX className="w-8 h-8" />}
        action={emptyAction}
        variant="search"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Верхняя панель */}
      {(showCount || showViewToggle) && (
        <div className="flex items-center justify-between">
          {showCount && (
            <p className="text-sm text-gray-500">
              Найдено{" "}
              <span className="font-semibold text-gray-900">{count}</span>{" "}
              {count === 1
                ? "объявление"
                : count < 5
                  ? "объявления"
                  : "объявлений"}
            </p>
          )}
          {showViewToggle && (
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
              <ViewBtn
                active={view === "grid"}
                onClick={() => setView("grid")}
                label="Сетка"
              >
                <LayoutGrid className="w-4 h-4" />
              </ViewBtn>
              <ViewBtn
                active={view === "list"}
                onClick={() => setView("list")}
                label="Список"
              >
                <List className="w-4 h-4" />
              </ViewBtn>
            </div>
          )}
        </div>
      )}

      {/* Сетка / список */}
      <div className={containerClass}>
        {listings.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
          >
            <ListingCard listing={l} compact={view === "list"} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ViewBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "w-8 h-8 rounded-md flex items-center justify-center transition",
        active
          ? "bg-brand-600 text-white"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
      )}
    >
      {children}
    </button>
  );
}
