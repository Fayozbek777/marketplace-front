import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

export function PublicRoute() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
