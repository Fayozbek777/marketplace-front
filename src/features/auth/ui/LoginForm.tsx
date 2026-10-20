import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLogin } from "../model/auth.hooks";
import { loginGuard } from "../model/login-guard";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/";

  const [ban, setBan] = useState(loginGuard.isBanned());

  // тикаем каждую секунду пока бан активен
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
    // проверка бана перед запросом
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

  // форматирование таймера
  const formatTime = (ms: number) => {
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // забанен — показать сообщение и таймер
  if (ban.banned) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-red-500 text-5xl">🚫</div>
        <h2 className="text-xl font-semibold">Слишком много попыток</h2>
        <p className="text-gray-600">
          Вход заблокирован на 5 минут из-за 5 неудачных попыток.
        </p>
        <p className="text-3xl font-mono font-bold text-brand-600">
          {formatTime(ban.remainingMs)}
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg"
        >
          На главную
        </Link>
      </div>
    );
  }

  const remaining = loginGuard.remainingAttempts();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Пароль"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      {remaining < 5 && remaining > 0 && (
        <p className="text-sm text-yellow-600 text-center">
          Осталось попыток: <b>{remaining}</b>
        </p>
      )}

      <Button type="submit" loading={login.isPending} className="w-full">
        Войти
      </Button>

      <p className="text-sm text-center text-gray-500">
        Нет аккаунта?{" "}
        <Link to="/register" className="text-brand-600">
          Регистрация
        </Link>
      </p>
    </form>
  );
}
