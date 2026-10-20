import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { useRegister } from "../model/auth.hooks";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function RegisterForm() {
  const reg = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Имя" {...register("name")} error={errors.name?.message} />
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
      <Input
        label="Повторите пароль"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <Input
        label="Телефон (необязательно)"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <Button type="submit" loading={reg.isPending} className="w-full">
        Зарегистрироваться
      </Button>
      <p className="text-sm text-center text-gray-500">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="text-brand-600">
          Войти
        </Link>
      </p>
    </form>
  );
}
