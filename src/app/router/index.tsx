import { Suspense, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Все lazy-страницы — для prefetch
const prefetch = [
  () => import("@/pages/home/HomePage"),
  () => import("@/pages/listings/ListingsPage"),
  () => import("@/pages/listings/ListingDetailPage"),
  () => import("@/pages/listings/CreateListingPage"),
  () => import("@/pages/favorites/FavoritesPage"),
  () => import("@/pages/profile/ProfilePage"),
  () => import("@/pages/profile/MyListingsPage"),
  () => import("@/pages/checkout/CheckoutPage"),
  () => import("@/pages/auth/LoginPage"),
  () => import("@/pages/auth/RegisterPage"),
  () => import("@/pages/not-found/NotFoundPage"),
];

export function AppRouter() {
  const [ready, setReady] = useState(false);
  const element = useRoutes(routes);

  useEffect(() => {
    // грузим все чанки в фоне (после первого рендера)
    Promise.all(prefetch.map((fn) => fn())).then(() => setReady(true));
  }, []);

  // пока все страницы не загружены — держим лоадер
  if (!ready) return <PageLoader />;

  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}
