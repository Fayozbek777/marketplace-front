import { useSearchParams } from "react-router-dom";
import { useListings, ListingGrid, ListingFilters } from "@/features/listings";
import { useListingsStore } from "@/features/listings";
import { Pagination } from "@/shared/ui/Pagination";
import { ErrorState } from "@/shared/ui/ErrorState";

export default function ListingsPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  const filters = useListingsStore((s) => s.filters);
  const setFilter = useListingsStore((s) => s.setFilter);

  const { data, isLoading, isError, refetch } = useListings({ q });

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      <ListingFilters />

      <div>
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <ListingGrid listings={data?.items} isLoading={isLoading} />

            {data && data.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={filters.page ?? 1}
                  pages={data.pages}
                  onPageChange={(p) => setFilter("page", p)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
