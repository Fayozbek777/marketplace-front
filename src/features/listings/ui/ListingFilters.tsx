import { useEffect, useState } from "react";
import { useListingsStore } from "../model/listings.store";
import { CATEGORIES, CITIES } from "@/shared/config/constants";
import { Select } from "@/shared/ui/Select";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function ListingFilters() {
  const filters = useListingsStore((s) => s.filters);
  const setFilter = useListingsStore((s) => s.setFilter);
  const reset = useListingsStore((s) => s.resetFilters);

  // локальный state для цены
  const [priceMin, setPriceMin] = useState(filters.price_min ?? "");
  const [priceMax, setPriceMax] = useState(filters.price_max ?? "");

  const debouncedMin = useDebounce(priceMin, 500);
  const debouncedMax = useDebounce(priceMax, 500);

  // синхронизация с store — только после debounce
  useEffect(() => {
    setFilter("price_min", debouncedMin || undefined);
  }, [debouncedMin, setFilter]);

  useEffect(() => {
    setFilter("price_max", debouncedMax || undefined);
  }, [debouncedMax, setFilter]);

  // при reset — сбрасываем локальные
  useEffect(() => {
    if (!filters.price_min) setPriceMin("");
    if (!filters.price_max) setPriceMax("");
  }, [filters.price_min, filters.price_max]);

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Фильтры</h3>
        <button
          onClick={reset}
          className="text-sm text-brand-600 hover:underline"
        >
          Сбросить
        </button>
      </div>

      <Select
        label="Категория"
        value={filters.category ?? ""}
        onChange={(e) => setFilter("category", e.target.value || undefined)}
        placeholder="Все"
        options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
      />

      <Select
        label="Город"
        value={filters.city ?? ""}
        onChange={(e) => setFilter("city", e.target.value || undefined)}
        placeholder="Все"
        options={CITIES.map((c) => ({ value: c.value, label: c.label }))}
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Цена, ₸
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="от"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm"
          />
          <input
            type="number"
            placeholder="до"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <Select
        label="Сортировка"
        value={filters.sort ?? "-created_at"}
        onChange={(e) => setFilter("sort", e.target.value as any)}
        options={[
          { value: "-created_at", label: "Новые" },
          { value: "created_at", label: "Старые" },
          { value: "price", label: "Дешевле" },
          { value: "-price", label: "Дороже" },
        ]}
      />
    </aside>
  );
}
