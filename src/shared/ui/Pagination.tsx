import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  /** Сколько номеров показывать вокруг текущего */
  siblings?: number;
  className?: string;
}

/** Строит массив: [1, "…", 4, 5, 6, "…", 20] */
function buildPages(
  current: number,
  total: number,
  siblings: number,
): (number | "ellipsis-l" | "ellipsis-r")[] {
  const totalNumbers = siblings * 2 + 5; // first + last + current + 2*siblings
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const range: (number | "ellipsis-l" | "ellipsis-r")[] = [];

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblings;
    for (let i = 1; i <= leftItemCount; i++) range.push(i);
    range.push("ellipsis-r");
    range.push(total);
  } else if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblings;
    range.push(1);
    range.push("ellipsis-l");
    for (let i = total - rightItemCount + 1; i <= total; i++) range.push(i);
  } else {
    range.push(1);
    range.push("ellipsis-l");
    for (let i = leftSibling; i <= rightSibling; i++) range.push(i);
    range.push("ellipsis-r");
    range.push(total);
  }

  return range;
}

export function Pagination({
  page,
  pages,
  onPageChange,
  siblings = 1,
  className,
}: Props) {
  if (pages <= 1) return null;

  const items = buildPages(page, pages, siblings);
  const canPrev = page > 1;
  const canNext = page < pages;

  return (
    <nav
      aria-label="Пагинация"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* Назад */}
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        aria-label="Предыдущая страница"
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center transition",
          "text-gray-600 hover:bg-gray-100",
          "disabled:opacity-40 disabled:pointer-events-none",
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Номера */}
      {items.map((item, idx) => {
        if (typeof item === "string") {
          return (
            <span
              key={`${item}-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-gray-400 select-none"
              aria-hidden="true"
            >
              …
            </span>
          );
        }
        const active = item === page;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition",
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {item}
          </button>
        );
      })}

      {/* Вперёд */}
      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        aria-label="Следующая страница"
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center transition",
          "text-gray-600 hover:bg-gray-100",
          "disabled:opacity-40 disabled:pointer-events-none",
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
