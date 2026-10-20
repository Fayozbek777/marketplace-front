import type { ListingShort } from "../types/listings.type";
import { ListingCard } from "./ListingCard";
import { ListingSkeleton } from "./ListingSkeleton";
import { EmptyState } from "@/shared/ui/EmptyState";

interface Props {
  listings: ListingShort[] | undefined;
  isLoading?: boolean;
  emptyTitle?: string;
}

export function ListingGrid({ listings, isLoading, emptyTitle }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return <EmptyState title={emptyTitle ?? "Объявлений пока нет"} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
