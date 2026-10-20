import { useEffect, useState } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useListingsStore } from "../model/listings.store";
import { CATEGORIES, CITIES } from "@/shared/config/constants";
import { Select } from "@/shared/ui/Select";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { cn } from "@/shared/lib/cn";

export function ListingFilters() {
  const filters = useListingsStore((s) => s.filters);
  const setFilter = useListingsStore((s) => s.setFilter);
  const reset = useListingsStore((s) => s.resetFilters);

  const [priceMin, setPriceMin] = useState(filters.price_min ?? "");
  const [priceMax, setPriceMax] = useState(filters.price_max ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const debouncedMin = useDebounce(priceMin, 500);
  const debouncedMax = useDebounce(priceMax, 500);

  useEffect(() => {
    setFilter("price_min", debouncedMin || undefined);
  }, [debouncedMin, setFilter]);

  useEffect(() => {
    setFilter("price_max", debouncedMax || undefined);
  }, [debouncedMax, setFilter]);

  useEffect(() => {
    if (!filters.price_min) setPriceMin("");
    if (!filters.price_max) setPriceMax("");
  }, [filters.price_min, filters.price_max]);

  const activeCount = [
    filters.category,
    filters.city,
    filters.price_min,
    filters.price_max,
  ].filter(Boolean).length;

  const content = (
    <div className="space-y-4">
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
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="от"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="до"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
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
    </div>
  );

  return (
    <>
      {/* Мобильная кнопка-триггер */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden w-full flex items-center justify-between px-4 h-11 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          Фильтры
          {activeCount > 0 && (
            <span className="px-1.5 h-5 min-w-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Десктоп — сайдбар */}
      <aside className="hidden lg:block space-y-4 sticky top-20 self-start">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            Фильтры
            {activeCount > 0 && (
              <span className="px-1.5 h-5 min-w-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </h3>
          <button
            onClick={reset}
            disabled={activeCount === 0}
            className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Сбросить
          </button>
        </div>
        {content}
      </aside>

      {/* Мобильная шторка */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                  Фильтры
                </h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 px-2"
                >
                  Готово
                </button>
              </div>
              <div className="p-4 overflow-y-auto">{content}</div>
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={reset}
                  disabled={activeCount === 0}
                  className="flex-1 h-11 rounded-xl border border-gray-300 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  Сбросить
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
