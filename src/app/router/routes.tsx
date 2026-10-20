import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PrivateRoute } from "./guards/PrivateRoute";
import { PublicRoute } from "./guards/PublicRoute";

// ============ Lazy ============
const HomePage = lazy(() => import("../../pages/home/HomePage"));
const ListingsPage = lazy(() => import("../../pages/listings/ListingsPage"));
const ListingDetailPage = lazy(
  () => import("@/pages/listings/ListingDetailPage"),
);
const CreateListingPage = lazy(
  () => import("@/pages/listings/CreateListingPage"),
);
const FavoritesPage = lazy(() => import("@/pages/favorites/FavoritesPage"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const MyListingsPage = lazy(() => import("@/pages/profile/MyListingsPage"));
const CheckoutPage = lazy(() => import("@/pages/checkout/CheckoutPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"));

// ============ Routes ============
export const routes: RouteObject[] = [
  // ===== Публичный layout (Header + Footer) =====
  {
    element: <RootLayout />,
    children: [
      // публичные
      { index: true, element: <HomePage /> },
      { path: "listings", element: <ListingsPage /> },
      { path: "listings/:id", element: <ListingDetailPage /> },

      // только для авторизованных
      {
        element: <PrivateRoute />,
        children: [
          { path: "listings/create", element: <CreateListingPage /> },
          { path: "favorites", element: <FavoritesPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "profile/listings", element: <MyListingsPage /> },
          { path: "checkout/:id", element: <CheckoutPage /> },
        ],
      },
    ],
  },

  // ===== Auth layout (только для гостей) =====
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },

  // ===== 404 (вне layout) =====
  { path: "*", element: <NotFoundPage /> },
];
