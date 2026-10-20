import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Eye,
  MapPin,
  Calendar,
  MessageCircle,
  Rocket,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  User,
  ShieldAlert,
  Share2,
} from "lucide-react";

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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-3">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-8 w-2/3 mt-6" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full mt-4" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <ErrorState
          title="Объявление не найдено"
          description="Возможно, оно удалено или ссылка устарела"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const image = data.images[imageIdx];
  const imagesCount = data.images.length;

  const prevImage = () =>
    setImageIdx((i) => (i - 1 + imagesCount) % imagesCount);
  const nextImage = () => setImageIdx((i) => (i + 1) % imagesCount);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          url: window.location.href,
        });
      } catch {
        /* пользователь отменил */
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Хлебные крошки */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-brand-600">
          Главная
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/listings" className="hover:text-brand-600">
          Объявления
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 truncate max-w-xs">{data.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* ===== Левая часть ===== */}
        <div className="min-w-0">
          {/* Галерея */}
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
            <AnimatePresence mode="wait">
              {image ? (
                <motion.img
                  key={image.id}
                  src={image.url}
                  alt={data.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                  <ImageOff className="w-12 h-12" />
                  <span className="text-sm">Нет фото</span>
                </div>
              )}
            </AnimatePresence>

            {data.is_promoted && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide bg-gradient-to-r from-amber-400 to-yellow-300 text-black rounded shadow">
                ★ ТОП
              </span>
            )}

            {imagesCount > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Предыдущее фото"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Следующее фото"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 text-xs text-white bg-black/60 rounded-full">
                  {imageIdx + 1} / {imagesCount}
                </span>
              </>
            )}
          </div>

          {/* Миниатюры */}
          {imagesCount > 1 && (
            <div className="flex gap-2 overflow-x-auto mt-2 pb-1">
              {data.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setImageIdx(i)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition shrink-0 ${
                    i === imageIdx
                      ? "border-brand-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.thumb_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Заголовок + мета */}
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              {data.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
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
          </div>

          {/* Описание */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Описание
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Правая часть ===== */}
        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          {/* Цена + действия */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(data.price)}
            </div>

            {data.is_promoted && (
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded">
                <Rocket className="w-3 h-3" />
                ТОП до{" "}
                {data.promoted_until
                  ? new Date(data.promoted_until).toLocaleDateString("ru-RU")
                  : "—"}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <FavoriteButton
                listingId={data.id}
                className="border border-gray-300 h-11 px-3 rounded-lg"
              />
              <button
                onClick={share}
                aria-label="Поделиться"
                className="h-11 w-11 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {!isOwner && (
                <Button className="flex-1" onClick={() => {}}>
                  <MessageCircle className="w-4 h-4" />
                  Написать
                </Button>
              )}
            </div>

            {isOwner && (
              <div className="mt-4 space-y-2">
                <Link to={`/checkout/${data.id}`} className="block">
                  <Button className="w-full" variant="secondary">
                    <Rocket className="w-4 h-4" />
                    Продвинуть
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </Button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Не переводите предоплату незнакомцам
            </p>
          </div>

          {/* Автор */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Автор</p>
                <p className="font-medium text-gray-900 truncate">
                  ID: {data.user_id.slice(0, 8)}…
                </p>
              </div>
            </div>
            <Link
              to={`/listings?author=${data.user_id}`}
              className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
            >
              Все объявления автора
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </div>

      {/* ===== Confirm delete ===== */}
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
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
            <Trash2 className="w-4 h-4" />
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
