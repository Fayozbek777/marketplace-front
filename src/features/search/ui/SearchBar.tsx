import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchStore } from "../model/search.store";
import { cn } from "@/shared/lib/cn";

interface Props {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Что ищете?" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const setQuery = useSearchStore((s) => s.setQuery);

  // начальное значение — из URL (F5 → сохраняется)
  const [value, setValue] = useState(params.get("q") ?? "");
  const debounced = useDebounce(value, 400);

  // синхронизация с URL при остановке ввода
  useEffect(() => {
    setQuery(debounced);

    const onListings =
      location.pathname === "/listings" || location.pathname === "/";

    if (!onListings) return;

    const current = params.get("q") ?? "";
    if (current === debounced) return; // не дёргаем navigate без изменений

    const next = new URLSearchParams(params);
    if (debounced) next.set("q", debounced);
    else next.delete("q");

    // сбрасываем page на 1 при поиске
    next.delete("page");

    navigate(
      { pathname: "/listings", search: next.toString() },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const handleClear = () => setValue("");

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-brand-500"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
          aria-label="Очистить"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
