import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchStore } from "../model/search.store";
import { cn } from "@/shared/lib/cn";

interface Props {
  className?: string;
  placeholder?: string;
  /** Автофокус при монтировании */
  autoFocus?: boolean;
  /** Показывать спиннер пока идёт debounce */
  showPending?: boolean;
}

export function SearchBar({
  className,
  placeholder = "Что ищете?",
  autoFocus,
  showPending = true,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const setQuery = useSearchStore((s) => s.setQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(params.get("q") ?? "");
  const debounced = useDebounce(value, 400);
  const pending = value !== debounced;

  // синхронизация с URL при остановке ввода
  useEffect(() => {
    setQuery(debounced);

    const onListings =
      location.pathname === "/listings" || location.pathname === "/";
    if (!onListings) return;

    const current = params.get("q") ?? "";
    if (current === debounced) return;

    const next = new URLSearchParams(params);
    if (debounced) next.set("q", debounced);
    else next.delete("q");
    next.delete("page");

    navigate(
      { pathname: "/listings", search: next.toString() },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Синхронизация при внешнем изменении URL (например, переход по категории)
  useEffect(() => {
    const q = params.get("q") ?? "";
    if (q !== value) setValue(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q")]);

  // Ctrl/Cmd+K — фокус в поиск
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            handleClear();
          }
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        aria-label="Поиск"
        className={cn(
          "w-full h-10 pl-9 pr-9 rounded-lg border border-gray-300 bg-white text-sm outline-none transition",
          "placeholder:text-gray-400",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        )}
      />

      {/* Справа: спиннер / очистка / хоткей */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {showPending && pending && (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        )}
        {value && !pending && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded hover:bg-gray-100 transition"
            aria-label="Очистить"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        {!value && !pending && (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 h-5 text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </div>
    </div>
  );
}
