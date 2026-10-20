import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Store,
  Car,
  Home,
  Briefcase,
  Smartphone,
  Shirt,
  Sofa,
  PawPrint,
  Bike,
  Gamepad2,
  Plus,
  Clock,
} from "lucide-react";
import { useListings } from "@/features/listings";
import { formatPrice } from "@/shared/lib/formatPrice";
import { CATEGORIES } from "@/shared/config/constants";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";

// Иконки для категорий. Если категорий больше — добавьте по аналогии.
const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  transport: Car,
  realty: Home,
  electronics: Smartphone,
  work: Briefcase,
  home: Sofa,
  fashion: Shirt,
  pets: PawPrint,
  sport: Bike,
  hobby: Gamepad2,
  services: Store,
};

const CITIES = [
  { name: "Москва", count: "124 500" },
  { name: "Санкт-Петербург", count: "68 200" },
  { name: "Казань", count: "24 100" },
  { name: "Новосибирск", count: "19 800" },
  { name: "Екатеринбург", count: "17 300" },
  { name: "Краснодар", count: "15 600" },
];

const STATS = [
  { value: "2.4M+", label: "объявлений" },
  { value: "890K", label: "пользователей" },
  { value: "120+", label: "городов" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Безопасная сделка",
    text: "Проверенные продавцы и защита покупателей",
  },
  {
    icon: Sparkles,
    title: "Умный поиск",
    text: "Найдём то, что нужно — за пару секунд",
  },
  {
    icon: TrendingUp,
    title: "Быстрая продажа",
    text: "Первое объявление за 30 секунд",
  },
];

// Время публикации в человеческом виде
function timeAgo(date?: string | Date) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "только что";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return `${Math.floor(diff / 86400)} дн назад`;
}

export default function HomePage() {
  const { data, isLoading } = useListings({ per_page: 8, page: 1 });

  return (
    <div className="bg-gray-50">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
        <div className="relative max-w-6xl mx-auto px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm backdrop-blur">
              <Sparkles className="w-4 h-4" /> Новая площадка объявлений
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Купи. Продай. <span className="text-emerald-200">Рядом.</span>
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Тысячи объявлений в твоём городе. Быстро, удобно и безопасно.
            </p>

            {/* Поиск */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col sm:flex-row gap-2 bg-white rounded-xl p-2 shadow-lg"
            >
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Что искать? Например, iPhone 15"
                  className="flex-1 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                />
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400" />
                <select className="py-2.5 text-gray-900 outline-none bg-transparent">
                  <option>Все города</option>
                  {CITIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition"
              >
                Найти
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              {STATS.map((s) => (
                <div key={s.label}>
                  <span className="font-bold text-white">{s.value}</span>{" "}
                  {s.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 py-12 space-y-16">
        {/* ================= КАТЕГОРИИ ================= */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Категории</h2>
            <Link
              to="/listings"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Все категории <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c.value] ?? Store;
              return (
                <Link
                  key={c.value}
                  to={`/listings?category=${c.value}`}
                  className="group flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-md transition"
                >
                  <span className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className="text-sm font-medium text-gray-800 text-center">
                    {c.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================= ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ ================= */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Последние объявления
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Свежие предложения от продавцов
              </p>
            </div>
            <Link
              to="/listings"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Смотреть все <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Скелетоны */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Пусто */}
          {!isLoading && !data?.items.length && <EmptyState />}

          {/* Карточки */}
          {!isLoading && !!data?.items.length && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.items.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link
                    to={`/listings/${l.id}`}
                    className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-400 transition"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {l.images[0] ? (
                        <img
                          src={l.images[0].thumb_url}
                          alt={l.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Store className="w-12 h-12" />
                        </div>
                      )}

                      {/* Бейдж категории */}
                      {l.category && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[11px] font-medium bg-white/90 text-gray-700 rounded-md backdrop-blur">
                          {l.category}
                        </span>
                      )}

                      {/* Время публикации */}
                      {l.created_at && (
                        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-black/60 text-white rounded-md">
                          <Clock className="w-3 h-3" />
                          {timeAgo(l.created_at)}
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(l.price)}
                      </div>
                      <div className="mt-0.5 text-sm text-gray-700 line-clamp-2 min-h-[2.5rem]">
                        {l.title}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {l.city}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ================= ГОРОДА ================= */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Ваш город</h2>
            <Link
              to="/cities"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Все города <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CITIES.map((city) => (
              <Link
                key={city.name}
                to={`/listings?city=${encodeURIComponent(city.name)}`}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-500 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 font-medium text-gray-800 group-hover:text-brand-600">
                  <MapPin className="w-4 h-4" />
                  {city.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {city.count} объявлений
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= ПРЕИМУЩЕСТВА ================= */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Почему у нас удобно
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_90%_10%,white,transparent_45%)]" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Есть что продать?
              </h2>
              <p className="mt-2 text-white/90 max-w-md">
                Разместите объявление за 30 секунд — и получите первые отклики
                уже сегодня.
              </p>
            </div>
            <Link
              to="/listings/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-gray-50 transition shadow"
            >
              <Plus className="w-5 h-5" />
              Разместить объявление
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
