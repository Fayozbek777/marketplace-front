import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useAuthStore, useLogout } from "@/features/auth";
import { useFavoritesCount } from "@/features/favorites";

export function MobileNav() {
  const { pathname } = useLocation();
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const { data: favCount } = useFavoritesCount();

  const links = [
    { to: "/", label: "Главная", icon: Home },
    { to: "/listings", label: "Поиск", icon: Search },
    {
      to: "/favorites",
      label: "Избранное",
      icon: Heart,
      badge: favCount?.count,
      private: true,
    },
    {
      to: isAuth ? "/profile" : "/login",
      label: "Профиль",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t lg:hidden">
      <div className="grid grid-cols-5 h-14">
        {/* Кнопка "+" по центру */}
        <Link
          to="/listings/create"
          className="flex items-center justify-center"
          aria-label="Создать"
        >
          <span className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center shadow">
            <Plus className="w-5 h-5" />
          </span>
        </Link>

        {links.map(({ to, label, icon: Icon, badge, private: isPrivate }) => {
          if (isPrivate && !isAuth) return <div key={label} />;
          const active = pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-xs relative",
                active ? "text-brand-600" : "text-gray-500",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {badge != null && badge > 0 && (
                <span className="absolute top-1 right-1/4 min-w-4 h-4 px-1 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
