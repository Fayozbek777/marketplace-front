import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-600 mt-4">Страница не найдена</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-brand-600 text-white rounded-lg"
      >
        На главную
      </Link>
    </div>
  );
}
