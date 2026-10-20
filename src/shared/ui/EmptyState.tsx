import { Inbox } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface Props {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: "default" | "error" | "search" | "compact";
  className?: string;
  /** Анимировать появление */
  animated?: boolean;
}

const VARIANT_META: Record<
  NonNullable<Props["variant"]>,
  { ring: string; iconBg: string; iconColor: string }
> = {
  default: {
    ring: "bg-gray-50",
    iconBg: "bg-white border border-gray-200",
    iconColor: "text-gray-400",
  },
  error: {
    ring: "bg-red-50",
    iconBg: "bg-white border border-red-100",
    iconColor: "text-red-500",
  },
  search: {
    ring: "bg-amber-50",
    iconBg: "bg-white border border-amber-100",
    iconColor: "text-amber-500",
  },
  compact: {
    ring: "bg-transparent",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
  },
};

export function EmptyState({
  title = "Ничего не найдено",
  description = "Попробуйте изменить фильтры или запрос",
  icon,
  action,
  variant = "default",
  className,
  animated = true,
}: Props) {
  const meta = VARIANT_META[variant];
  const isCompact = variant === "compact";

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact ? "py-8 px-4" : "py-16 px-4",
        className,
      )}
    >
      <div className="relative mb-4">
        {!isCompact && (
          <span
            className={cn(
              "absolute inset-0 rounded-full scale-150 blur-xl opacity-60",
              meta.ring,
            )}
            aria-hidden="true"
          />
        )}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-2xl shadow-sm",
            isCompact ? "w-12 h-12" : "w-16 h-16",
            meta.iconBg,
            meta.iconColor,
          )}
        >
          {icon ?? <Inbox className={isCompact ? "w-6 h-6" : "w-8 h-8"} />}
        </div>
      </div>

      <h3
        className={cn(
          "font-semibold text-gray-900",
          isCompact ? "text-base" : "text-lg",
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "mt-1 text-sm text-gray-500",
            isCompact ? "max-w-xs" : "max-w-sm",
          )}
        >
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}
