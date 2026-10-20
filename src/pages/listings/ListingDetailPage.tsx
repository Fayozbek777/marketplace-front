import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useListing,
  useTrackView,
  useDeleteListing,
} from "@/features/listings";
import { FavoriteButton } from "@/features/favorites";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { useAuthStore } from "@/features/auth";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Modal } from "@/shared/ui/Modal";
import { Eye, MapPin, Calendar } from "lucide-react";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useListing(id);
  useTrackView(id);

  const userId = useAuthStore((s) => s.user?.id);
  const isOwner = data && userId === data.user_id;

  const del = useDeleteListing();
  const [confirm, setConfirm] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="aspect-video w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const image = data.images[imageIdx];

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Левая часть: фото + описание */}
      <div>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
          {image ? (
            <img
              src={image.url}
              alt={data.title}
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>

        {data.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {data.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setImageIdx(i)}
                className={`w-20 h-20 border-2 rounded ${
                  i === imageIdx ? "border-brand-500" : "border-transparent"
                }`}
              >
                <img
                  src={img.thumb_url}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold mt-6">{data.title}</h1>
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {data.city}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {data.views}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatRelative(data.created_at)}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Описание</h2>
          <p className="whitespace-pre-line text-gray-700">
            {data.description}
          </p>
        </div>
      </div>

      {/* Правая часть: цена + действия */}
      <aside className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-3xl font-bold">{formatPrice(data.price)}</div>
          {data.is_promoted && (
            <div className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded inline-block mt-1">
              ТОП до{" "}
              {data.promoted_until
                ? new Date(data.promoted_until).toLocaleDateString()
                : "—"}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <FavoriteButton listingId={data.id} className="border" />
            {!isOwner && <Button className="flex-1">Написать</Button>}
          </div>

          {isOwner && (
            <div className="mt-4 space-y-2">
              <Link to={`/checkout/${data.id}`} className="block">
                <Button className="w-full" variant="secondary">
                  Продвинуть
                </Button>
              </Link>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => setConfirm(true)}
              >
                Удалить
              </Button>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 text-sm">
          <p className="text-gray-500">Автор</p>
          <p className="font-medium">ID: {data.user_id.slice(0, 8)}…</p>
          <Link
            to={`/listings?author=${data.user_id}`}
            className="text-brand-600 text-xs"
          >
            Все объявления автора →
          </Link>
        </div>
      </aside>

      {/* Confirm delete */}
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Удалить объявление?"
      >
        <p className="text-gray-600 mb-4">
          Объявление будет скрыто. Действие можно отменить только через
          поддержку.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirm(false)}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={del.isPending}
            onClick={() =>
              del.mutate(data.id, {
                onSuccess: () => navigate("/profile/listings"),
              })
            }
          >
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
