import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useListings, ListingGrid, ListingFilters } from "@/features/listings";
import { useListingsStore } from "@/features/listings";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Pagination } from "@/shared/ui/Pagination";

export default function ListingsPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  const filters = useListingsStore((s) => s.filters);
  const setFilter = useListingsStore((s) => s.setFilter);

  const { data, isLoading, isError, refetch } = useListings({ q });

  const resetFilters = useListingsStore((s) => s.resetFilters);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {q ? `Результаты по «${q}»` : "Объявления"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {q
            ? "Нажмите на объявление, чтобы посмотреть детали"
            : "Тысячи предложений от продавцов в вашем городе"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <ListingFilters />

        <div className="min-w-0">
          {isError ? (
            <ErrorState
              title="Не удалось загрузить объявления"
              description="Проверьте соединение и попробуйте снова"
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <ListingGrid
                listings={data?.items}
                isLoading={isLoading}
                emptyTitle={
                  q ? "По запросу ничего не нашлось" : "Объявлений пока нет"
                }
                emptyDescription={
                  q
                    ? "Попробуйте изменить запрос или сбросить фильтры"
                    : "Станьте первым — разместите объявление"
                }
                emptyAction={
                  q ? (
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      Сбросить фильтры
                    </button>
                  ) : null
                }
              />

              {data && data.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8 flex justify-center"
                >
                  <Pagination
                    page={filters.page ?? 1}
                    pages={data.pages}
                    onPageChange={(p) => {
                      setFilter("page", p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
