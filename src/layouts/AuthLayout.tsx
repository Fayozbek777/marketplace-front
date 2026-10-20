import { Outlet, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-brand-600 hover:text-brand-700 transition"
        >
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          Marketplace
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <Outlet />
        </div>
      </main>

      <footer className="pb-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Marketplace. Все права защищены.
      </footer>
    </div>
  );
}
