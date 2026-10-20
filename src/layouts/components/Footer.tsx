import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-bold text-brand-600 text-lg mb-2">
            Marketplace
          </div>
          <p className="text-gray-500">
            Доска объявлений. Демо-проект для портфолио.
          </p>
        </div>

        <div>
          <div className="font-semibold mb-2">Разделы</div>
          <ul className="space-y-1 text-gray-600">
            <li>
              <Link to="/listings" className="hover:text-brand-600">
                Объявления
              </Link>
            </li>
            <li>
              <Link to="/listings/create" className="hover:text-brand-600">
                Разместить
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-brand-600">
                Избранное
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">Аккаунт</div>
          <ul className="space-y-1 text-gray-600">
            <li>
              <Link to="/login" className="hover:text-brand-600">
                Вход
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-brand-600">
                Регистрация
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-brand-600">
                Профиль
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">О проекте</div>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-600"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="http://localhost:8000/api/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-600"
              >
                API Docs
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Marketplace · Демо
      </div>
    </footer>
  );
}
