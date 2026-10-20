import { Link } from "react-router-dom";
import { ExternalLink, Sparkles } from "lucide-react";

const SECTIONS = [
  {
    title: "Разделы",
    links: [
      { to: "/listings", label: "Объявления" },
      { to: "/listings/create", label: "Разместить" },
      { to: "/favorites", label: "Избранное" },
    ],
  },
  {
    title: "Аккаунт",
    links: [
      { to: "/login", label: "Вход" },
      { to: "/register", label: "Регистрация" },
      { to: "/profile", label: "Профиль" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-lg text-brand-600 hover:text-brand-700 transition"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            Marketplace
          </Link>
          <p className="text-gray-500 mt-3 max-w-xs">
            Доска объявлений. Демо-проект для портфолио.
          </p>
        </div>

        {SECTIONS.map((s) => (
          <div key={s.title}>
            <div className="font-semibold text-gray-900 mb-3">{s.title}</div>
            <ul className="space-y-2 text-gray-600">
              {s.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-brand-600 transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="font-semibold text-gray-900 mb-3">О проекте</div>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-brand-600 transition"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="http://localhost:8000/api/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-brand-600 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                API Docs
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Marketplace · Демо
      </div>
    </footer>
  );
}
