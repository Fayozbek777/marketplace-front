import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Plus,
  Rocket,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Package,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMyListings, useDeleteListing } from "@/features/listings";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Modal } from "@/shared/ui/Modal";
import { cn } from "@/shared/lib/cn";

const STATUS_META: Record<string, { label: string; className: string }> = {
  active: {
    label: "Активно",
    className: "bg-emerald-100 text-emerald-700",
  },
  sold: {
    label: "Продано",
    className: "bg-gray-100 text-gray-700",
  },
  archived: {
    label: "Архив",
    className: "bg-amber-100 text-amber-800",
  },
  rejected: {
    label: "Отклонено",
    className: "bg-red-100 text-red-700",
  },
};

export default function MyListingsPage() {
  const { data, isLoading } = useMyListings();
  const del = useDeleteListing();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const count = data?.length ?? 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои объявления</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading
              ? "Загрузка…"
              : `Всего: ${count} ${
                  count === 1
                    ? "объявление"
                    : count < 5
                      ? "объявления"
                      : "объявлений"
                }`}
          </p>
        </div>
        <Link to="/listings/create">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Создать
          </Button>
        </Link>
      </div>

      {/* Скелетоны */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Пусто */}
      {!isLoading && (!data || data.length === 0) && (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="У вас пока нет объявлений"
          description="Разместите первое объявление — покупатели уже ищут"
          action={
            <Link to="/listings/create">
              <Button>
                <Plus className="w-4 h-4" />
                Создать объявление
              </Button>
            </Link>
          }
        />
      )}

      {/* Список */}
      {!isLoading && data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((l, i) => {
            const status = STATUS_META[l.status] ?? {
              label: l.status,
              className: "bg-gray-100 text-gray-700",
            };
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/listings/${l.id}`}
                        className="font-semibold text-gray-900 hover:text-brand-600 transition truncate"
                      >
                        {l.title}
                      </Link>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[11px] font-semibold rounded-full",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(l.price)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {l.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatRelative(l.created_at)}
                      </span>
                      {typeof l.views === "number" && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {l.views}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/checkout/${l.id}`}>
                      <Button variant="secondary" size="sm">
                        <Rocket className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Продвинуть</span>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setConfirmId(l.id)}
                      aria-label="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Удалить</span>
                    </Button>
                    <Link
                      to={`/listings/${l.id}`}
                      aria-label="Открыть"
                      className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-gray-50 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Удалить объявление?"
        description="Это действие нельзя отменить"
        size="sm"
      >
        <p className="text-gray-600 mb-5">
          Объявление будет скрыто. Восстановить его можно только через
          поддержку.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmId(null)}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={del.isPending}
            onClick={() =>
              confirmId &&
              del.mutate(confirmId, { onSuccess: () => setConfirmId(null) })
            }
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
