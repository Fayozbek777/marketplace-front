import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Compass, Store } from "lucide-react";

const SUGGESTIONS = [
  { to: "/listings", label: "Все объявления", icon: Search },
  { to: "/listings/create", label: "Разместить объявление", icon: Store },
  { to: "/", label: "На главную", icon: Home },
];

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gray-50 px-4">
      {/* Декоративные круги */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-100/60 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md text-center"
      >
        {/* Иконка-компас */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-brand-600">
          <Compass className="w-8 h-8" />
        </div>

        {/* 404 */}
        <h1 className="mt-6 text-8xl font-black tracking-tight bg-gradient-to-br from-brand-600 to-emerald-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Страница не найдена
        </h2>
        <p className="mt-2 text-gray-600">
          Возможно, объявление уже продано, ссылка устарела или в адресе
          опечатка.
        </p>

        {/* Кнопки */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-white text-gray-800 font-medium rounded-lg transition w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </div>

        {/* Полезные ссылки */}
        <div className="mt-10">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            Может быть полезно
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex items-center gap-2 justify-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-brand-400 hover:text-brand-600 transition"
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
