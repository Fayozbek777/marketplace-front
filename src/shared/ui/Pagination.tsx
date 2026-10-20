import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pages, onPageChange }: Props) {
  if (pages <= 1) return null;

  const visible = getPages(page, pages);

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
        aria-label="Назад"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visible.map((p, i) =>
        p === "..." ? (
          <span key={`dot-${i}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "h-9 min-w-9 px-3 rounded-lg border text-sm",
              p === page
                ? "bg-brand-600 text-white border-brand-600"
                : "border-gray-300 hover:bg-gray-50",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
        aria-label="Вперёд"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

function getPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
