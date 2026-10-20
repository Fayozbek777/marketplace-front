import { Link } from "react-router-dom";
import { useMyListings, useDeleteListing } from "@/features/listings";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";

export default function MyListingsPage() {
  const { data, isLoading } = useMyListings();
  const del = useDeleteListing();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Мои объявления</h1>
        <Link to="/listings/create">
          <Button>+ Создать</Button>
        </Link>
      </div>

      {isLoading && <Skeleton className="h-32" />}

      {!isLoading && (!data || data.length === 0) && (
        <EmptyState title="У вас пока нет объявлений" />
      )}

      {!isLoading && data && (
        <div className="space-y-2">
          {data.map((l) => (
            <div
              key={l.id}
              className="border rounded-lg p-4 flex items-center justify-between bg-white"
            >
              <div>
                <Link
                  to={`/listings/${l.id}`}
                  className="font-medium hover:underline"
                >
                  {l.title}
                </Link>
                <div className="text-sm text-gray-500">
                  {formatPrice(l.price)} · {l.city} ·{" "}
                  {formatRelative(l.created_at)}
                </div>
                <div className="text-xs mt-1">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      l.status === "active"
                        ? "bg-green-100 text-green-700"
                        : l.status === "sold"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/checkout/${l.id}`}>
                  <Button variant="secondary" size="sm">
                    Продвинуть
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmId(l.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Удалить?"
      >
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
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
