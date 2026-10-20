import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header — заглушка, заменим на <Header /> позже */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-brand-600">Marketplace</span>
          <nav className="flex gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-brand-600">
              Главная
            </a>
            <a href="/listings" className="hover:text-brand-600">
              Объявления
            </a>
          </nav>
        </div>
      </header>

      {/* Контент страницы */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer — заглушка */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} Marketplace</span>
          <span>Демо-проект</span>
        </div>
      </footer>
    </div>
  );
}
