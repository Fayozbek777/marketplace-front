import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLogin } from "../model/auth.hooks";
import { loginGuard } from "../model/login-guard";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

const MAX_ATTEMPTS = 5;

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/";

  const [ban, setBan] = useState(loginGuard.isBanned());

  // тикаем каждую секунду, пока бан активен
  useEffect(() => {
    if (!ban.banned) return;
    const timer = setInterval(() => {
      const current = loginGuard.isBanned();
      setBan(current);
      if (!current.banned) {
        loginGuard.reset();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [ban.banned]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (v: LoginFormValues) => {
    const current = loginGuard.isBanned();
    if (current.banned) {
      setBan(current);
      return;
    }

    login.mutate(v, {
      onSuccess: () => {
        loginGuard.registerSuccess();
        navigate(from, { replace: true });
      },
      onError: () => {
        const result = loginGuard.registerFail();
        if (result.banned) setBan(result);
      },
    });
  };

  const formatTime = (ms: number) => {
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ================= BAN SCREEN =================
  if (ban.banned) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6 text-center"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Слишком много попыток
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Вход заблокирован на 5 минут из-за {MAX_ATTEMPTS} неудачных попыток.
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 py-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Попробуйте через
          </p>
          <p className="text-5xl font-mono font-bold text-brand-600 mt-2 tabular-nums">
            {formatTime(ban.remainingMs)}
          </p>
        </div>

        <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${100 - Math.min(100, (ban.remainingMs / (5 * 60 * 1000)) * 100)}%`,
            }}
            transition={{ duration: 0.5 }}
            className="h-full bg-brand-600"
          />
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition"
        >
          На главную
        </Link>
      </motion.div>
    );
  }

  // ================= FORM =================
  const remaining = loginGuard.remainingAttempts();
  const used = Math.max(0, MAX_ATTEMPTS - remaining);
  const showAttempts = remaining < MAX_ATTEMPTS && remaining > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">С возвращением 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          Войдите, чтобы управлять объявлениями
        </p>
      </div>

      {showAttempts && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                Осталось попыток: <b>{remaining}</b> из {MAX_ATTEMPTS}
              </p>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition ${
                      i < used ? "bg-red-400" : "bg-amber-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-[42px] pointer-events-none" />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          className="pl-9"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <div className="relative">
        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-[42px] pointer-events-none" />
        <Input
          label="Пароль"
          type="password"
          placeholder="••••••••"
          className="pl-9"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      <Button
        type="submit"
        loading={login.isPending}
        className="w-full inline-flex items-center justify-center gap-2"
      >
        Войти
        <ArrowRight className="w-4 h-4" />
      </Button>

      <div className="pt-4 border-t border-gray-100 text-sm text-center text-gray-500">
        Нет аккаунта?{" "}
        <Link
          to="/register"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
}
