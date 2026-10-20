import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useAuthStore } from "@/features/auth";
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

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        {/* Левые 2 ссылки */}
        {links.slice(0, 2).map((link) => (
          <NavItem key={link.label} {...link} active={isActive(link.to)} />
        ))}

        {/* Центральная кнопка "+" */}
        <div className="relative flex items-center justify-center">
          <Link
            to="/listings/create"
            aria-label="Создать объявление"
            className="absolute -top-5 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-lg ring-4 ring-white transition active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </Link>
          <span className="text-[10px] text-gray-500 mt-8 font-medium">
            Создать
          </span>
        </div>

        {/* Правые 2 ссылки */}
        {links.slice(2).map((link) => {
          if (link.private && !isAuth) {
            return (
              <Link
                key="login-placeholder"
                to="/login"
                className="flex flex-col items-center justify-center gap-0.5 text-[11px] text-gray-500"
              >
                <Heart className="w-5 h-5" />
                <span>Избранное</span>
              </Link>
            );
          }
          return (
            <NavItem key={link.label} {...link} active={isActive(link.to)} />
          );
        })}
      </div>
    </nav>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  badge,
  active,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5 text-[11px] transition",
        active ? "text-brand-600" : "text-gray-500 hover:text-gray-700",
      )}
    >
      <span className="relative">
        <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 text-[10px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center shadow">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className={cn(active && "font-semibold")}>{label}</span>
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-600" />
      )}
    </Link>
  );
}
