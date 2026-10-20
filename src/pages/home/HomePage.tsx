import { Link } from "react-router-dom";
import { useListings } from "@/features/listings";
import { formatPrice } from "@/shared/lib/formatPrice";
import { CATEGORIES } from "@/shared/config/constants";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";

export default function HomePage() {
  const { data, isLoading } = useListings({ per_page: 8, page: 1 });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* HERO */}
      <section>
        <h1 className="text-3xl font-bold">Купи. Продай. Рядом.</h1>
        <p className="mt-2 text-gray-600">Тысячи объявлений в твоём городе</p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/listings"
            className="px-4 py-2 bg-brand-600 text-white rounded-lg"
          >
            Смотреть объявления
          </Link>
          <Link to="/listings/create" className="px-4 py-2 border rounded-lg">
            + Разместить
          </Link>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Категории</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to={`/listings?category=${c.value}`}
              className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Последние объявления</h2>
          <Link to="/listings" className="text-sm text-brand-600">
            Смотреть все →
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        )}

        {!isLoading && !data?.items.length && <EmptyState />}

        {!isLoading && !!data?.items.length && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.items.map((l) => (
              <Link
                key={l.id}
                to={`/listings/${l.id}`}
                className="border rounded-lg overflow-hidden hover:shadow"
              >
                <div className="aspect-square bg-gray-100">
                  {l.images[0] ? (
                    <img
                      src={l.images[0].thumb_url}
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-3">
                  <div className="font-semibold">{formatPrice(l.price)}</div>
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {l.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{l.city}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
