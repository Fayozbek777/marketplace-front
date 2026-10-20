import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, LogOut, Plus, User as UserIcon, Menu, X } from "lucide-react";
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

  const onLogout = () => {
    logout.mutate(undefined, { onSuccess: () => navigate("/") });
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Лого */}
        <Link
          to="/"
          className="text-xl font-bold text-brand-600 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          Marketplace
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
                "px-3 py-2 text-sm rounded-lg hover:bg-gray-100",
                isActive && "text-brand-600 font-medium",
              )
            }
          >
            Объявления
          </NavLink>

          <Link
            to="/listings/create"
            className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Разместить
          </Link>
        </nav>

        {/* Избранное */}
        {isAuth && (
          <Link
            to="/favorites"
            className="relative p-2 rounded-lg hover:bg-gray-100 shrink-0"
            aria-label="Избранное"
          >
            <Heart className="w-5 h-5" />
            {favCount != null && favCount.count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                {favCount.count > 99 ? "99+" : favCount.count}
              </span>
            )}
          </Link>
        )}

        {/* User menu / Login */}
        {isAuth ? (
          <div className="relative hidden lg:block">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm max-w-24 truncate">
                {user?.name ?? "Профиль"}
              </span>
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-20 py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Профиль
                  </Link>
                  <Link
                    to="/profile/listings"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Мои объявления
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Выйти
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="px-3 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Регистрация
            </Link>
          </div>
        )}

        {/* Мобильное меню кнопка */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 ml-auto"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Меню"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Мобильное меню (drawer) */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white p-4 space-y-2">
          <div className="md:hidden mb-2">
            <SearchBar />
          </div>
          <Link
            to="/listings"
            className="block px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Объявления
          </Link>
          <Link
            to="/listings/create"
            className="block px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Разместить
          </Link>
          {isAuth ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                Профиль
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-gray-100"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-lg bg-brand-600 text-white"
                onClick={() => setMobileOpen(false)}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
