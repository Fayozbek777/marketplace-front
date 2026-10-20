import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Лого сверху */}
      <header className="p-6">
        <Link
          to="/"
          className="text-2xl font-bold text-brand-600 hover:text-brand-700"
        >
          Marketplace
        </Link>
      </header>

      {/* Форма по центру */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
