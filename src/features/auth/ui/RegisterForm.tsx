import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { useRegister } from "../model/auth.hooks";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

// ===== Индикатор сложности пароля =====
function passwordStrength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0..4
}

const STRENGTH_META = [
  { label: "Слишком короткий", color: "bg-gray-300" },
  { label: "Слабый", color: "bg-red-400" },
  { label: "Средний", color: "bg-amber-400" },
  { label: "Хороший", color: "bg-emerald-400" },
  { label: "Надёжный", color: "bg-emerald-500" },
];

function PasswordStrength({ value }: { value: string }) {
  const score = passwordStrength(value);
  const meta = STRENGTH_META[score];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < score ? meta.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Надёжность пароля:{" "}
        <span className="font-medium text-gray-700">{meta.label}</span>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const reg = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password" }) ?? "";
  const score = useMemo(() => passwordStrength(password), [password]);

  const onSubmit = (v: RegisterFormValues) => {
    reg.mutate(
      {
        email: v.email,
        password: v.password,
        name: v.name,
        phone: v.phone ?? null,
      },
      { onSuccess: () => navigate("/") },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Создать аккаунт</h1>
        <p className="text-sm text-gray-500 mt-1">
          Минута — и вы сможете продавать и покупать
        </p>
      </div>

      <div className="relative">
        <User className="w-4 h-4 text-gray-400 absolute left-3 top-[42px] pointer-events-none" />
        <Input
          label="Имя"
          placeholder="Как к вам обращаться"
          className="pl-9"
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />
      </div>

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
        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-[42px] pointer-events-none" />
        <Input
          label="Телефон (необязательно)"
          placeholder="+7 (___) ___-__-__"
          className="pl-9"
          autoComplete="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-[42px] pointer-events-none" />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            className="pl-9"
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-[42px] pointer-events-none" />
          <Input
            label="Повторите пароль"
            type="password"
            placeholder="••••••••"
            className="pl-9"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>

      {password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <PasswordStrength value={password} />
        </motion.div>
      )}

      <ul className="space-y-1.5 text-xs text-gray-500">
        <ReqItem ok={password.length >= 8}>Минимум 8 символов</ReqItem>
        <ReqItem ok={/[A-Z]/.test(password)}>
          Хотя бы одна заглавная буква
        </ReqItem>
        <ReqItem ok={/[0-9]/.test(password)}>Хотя бы одна цифра</ReqItem>
      </ul>

      <Button
        type="submit"
        loading={reg.isPending}
        className="w-full inline-flex items-center justify-center gap-2"
      >
        Зарегистрироваться
        <ArrowRight className="w-4 h-4" />
      </Button>

      <div className="pt-4 border-t border-gray-100 text-sm text-center text-gray-500">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Войти
        </Link>
      </div>
    </form>
  );
}

function ReqItem({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          ok ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
        }`}
      >
        {ok ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
      </span>
      <span className={ok ? "text-emerald-700" : "text-gray-500"}>
        {children}
      </span>
    </li>
  );
}
