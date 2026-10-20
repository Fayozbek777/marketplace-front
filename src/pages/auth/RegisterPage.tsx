import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { RegisterForm } from "@/features/auth";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Публикация за минуту",
    text: "Простая форма — и объявление уже в ленте",
  },
  {
    icon: ShieldCheck,
    title: "Защита аккаунта",
    text: "Безопасный вход и контроль сессий",
  },
  {
    icon: TrendingUp,
    title: "Больше откликов",
    text: "Продвижение и статистика по объявлениям",
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-gray-50">
      {/* Левая колонка — презентация */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-emerald-500 text-white p-12">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />

        <div className="relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-lg"
          >
            <span className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            Marketplace
          </Link>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Начните продавать уже сегодня
          </h2>
          <p className="text-white/90 max-w-md">
            Создайте аккаунт, разместите объявление — и получите первых
            покупателей в течение дня.
          </p>
          <ul className="space-y-4 mt-8">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-medium">{f.title}</div>
                  <div className="text-sm text-white/80">{f.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-sm text-white/70">
          © {new Date().getFullYear()} Marketplace. Все права защищены.
        </div>
      </div>

      {/* Правая колонка — форма */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
