import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  LogOut,
  Plus,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  LayoutGrid,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useLogout } from "@/features/auth";
import { useFavoritesCount } from "@/features/favorites";
import { SearchBar } from "@/features/search/ui/SearchBar";
import { cn } from "@/shared/lib/cn";

export function Header() {
  const navigate = useNavigate();
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const { data: favCount } = useFavoritesCount();
  const logout = useLogout();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню по клику вне и по Esc
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  // Блокировка скролла при мобильном меню
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const onLogout = () => {
    logout.mutate(undefined, { onSuccess: () => navigate("/") });
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3 sm:gap-4">
        {/* Лого */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-brand-600 shrink-0 hover:text-brand-700 transition"
          onClick={closeMobile}
        >
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">Marketplace</span>
        </Link>

        {/* Поиск (десктоп) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Десктоп-навигация */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              cn(
                "px-3 py-2 text-sm rounded-lg transition hover:bg-gray-100",
                isActive && "text-brand-600 font-medium bg-brand-50",
              )
            }
          >
            Объявления
          </NavLink>

          <Link
            to="/listings/create"
            className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" /> Разместить
          </Link>
        </nav>

        {/* Избранное */}
        {isAuth && (
          <Link
            to="/favorites"
            className="relative p-2 rounded-lg hover:bg-gray-100 shrink-0 transition"
            aria-label="Избранное"
          >
            <Heart className="w-5 h-5" />
            {favCount != null && favCount.count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center shadow">
                {favCount.count > 99 ? "99+" : favCount.count}
              </span>
            )}
          </Link>
        )}

        {/* User menu / Login (десктоп) */}
        {isAuth ? (
          <div className="relative hidden lg:block" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition",
                userMenuOpen && "bg-gray-100",
              )}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
            >
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </span>
              <span className="text-sm max-w-24 truncate">
                {user?.name ?? "Профиль"}
              </span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 py-1"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user?.name ?? "Профиль"}
                    </div>
                    {user?.email && (
                      <div className="text-xs text-gray-500 truncate">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" /> Профиль
                  </Link>
                  <Link
                    to="/profile/listings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutGrid className="w-4 h-4" /> Мои объявления
                  </Link>
                  <Link
                    to="/profile/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Настройки
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" /> Выйти
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-sm"
            >
              Регистрация
            </Link>
          </div>
        )}

        {/* Мобильное меню кнопка */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 ml-auto transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Мобильное меню (drawer) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-16 bg-black/30 z-30"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 p-4 space-y-1 shadow-lg z-40 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="md:hidden mb-3">
                <SearchBar />
              </div>

              <MobileLink to="/listings" onClick={closeMobile}>
                Объявления
              </MobileLink>
              <MobileLink to="/listings/create" onClick={closeMobile}>
                <Plus className="w-4 h-4" /> Разместить
              </MobileLink>

              {isAuth ? (
                <>
                  <MobileLink to="/favorites" onClick={closeMobile}>
                    <Heart className="w-4 h-4" /> Избранное
                    {favCount != null && favCount.count > 0 && (
                      <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                        {favCount.count > 99 ? "99+" : favCount.count}
                      </span>
                    )}
                  </MobileLink>
                  <MobileLink to="/profile" onClick={closeMobile}>
                    <UserIcon className="w-4 h-4" /> Профиль
                  </MobileLink>
                  <MobileLink to="/profile/listings" onClick={closeMobile}>
                    <LayoutGrid className="w-4 h-4" /> Мои объявления
                  </MobileLink>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Выйти
                  </button>
                </>
              ) : (
                <div className="pt-2 mt-2 border-t border-gray-100 space-y-2">
                  <Link
                    to="/login"
                    className="block text-center px-3 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium transition"
                    onClick={closeMobile}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center px-3 py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 text-sm font-medium transition"
                    onClick={closeMobile}
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
    >
      {children}
    </Link>
  );
}
