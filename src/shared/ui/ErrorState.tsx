import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void | Promise<void>;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: "default" | "warning" | "compact";
  className?: string;
  animated?: boolean;
}

const VARIANT_META: Record<
  NonNullable<Props["variant"]>,
  { ring: string; iconBg: string; iconColor: string }
> = {
  default: {
    ring: "bg-red-50",
    iconBg: "bg-red-50 border border-red-100",
    iconColor: "text-red-500",
  },
  warning: {
    ring: "bg-amber-50",
    iconBg: "bg-amber-50 border border-amber-100",
    iconColor: "text-amber-500",
  },
  compact: {
    ring: "bg-transparent",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
};

export function ErrorState({
  title = "Что-то пошло не так",
  description = "Не удалось загрузить данные",
  onRetry,
  icon,
  action,
  variant = "default",
  className,
  animated = true,
}: Props) {
  const [retrying, setRetrying] = useState(false);
  const meta = VARIANT_META[variant];
  const isCompact = variant === "compact";

  const handleRetry = async () => {
    if (!onRetry || retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

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
          {icon ?? (
            <AlertCircle className={isCompact ? "w-6 h-6" : "w-8 h-8"} />
          )}
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

      {(onRetry || action) && (
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none"
            >
              <RefreshCw
                className={cn("w-4 h-4", retrying && "animate-spin")}
              />
              {retrying ? "Загрузка…" : "Повторить"}
            </button>
          )}
          {action}
        </div>
      )}
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
