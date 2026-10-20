import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  LogOut,
  Save,
  ShieldCheck,
} from "lucide-react";
import { profileSchema, type ProfileFormValues } from "@/schemas/profile.chema";
import { useProfile, useUpdateProfile } from "@/features/profile";
import { useLogout } from "@/features/auth";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function ProfilePage() {
  const { data: me, isLoading } = useProfile();
  const update = useUpdateProfile();
  const logout = useLogout();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: me
      ? {
          name: me.name,
          phone: me.phone ?? "",
          city: me.city ?? "",
          bio: me.bio ?? "",
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!me) return null;

  const onSubmit = (v: ProfileFormValues) =>
    update.mutate(
      {
        name: v.name,
        phone: v.phone || null,
        city: v.city || null,
        bio: v.bio || null,
      },
      { onSuccess: (data) => reset(data) },
    );

  const initials = me.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Управляйте личными данными и настройками аккаунта
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => logout.mutate()}
          loading={logout.isPending}
          className="w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </Button>
      </div>

      {/* Карточка-шапка */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="border border-gray-200 rounded-xl bg-white p-5 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
          {initials || <User className="w-6 h-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate">{me.name}</div>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{me.email}</span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Аккаунт активен
        </span>
      </motion.div>

      {/* Форма */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-gray-200 bg-white p-5 space-y-4"
      >
        <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">
          Личные данные
        </h2>

        <Input
          label="Имя"
          placeholder="Как к вам обращаться"
          leftIcon={<User className="w-4 h-4" />}
          required
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Телефон"
          placeholder="+7 (___) ___-__-__"
          leftIcon={<Phone className="w-4 h-4" />}
          autoComplete="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Input
          label="Город"
          placeholder="Ваш город"
          leftIcon={<MapPin className="w-4 h-4" />}
          autoComplete="address-level2"
          {...register("city")}
          error={errors.city?.message}
        />

        <Textarea
          label="О себе"
          placeholder="Расскажите покупателям о себе — это повышает доверие"
          rows={4}
          maxLength={500}
          showCount
          hint="Необязательно, но полезно"
          {...register("bio")}
          error={errors.bio?.message}
        />

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            disabled={!isDirty || update.isPending}
            onClick={() => reset()}
          >
            Отменить
          </Button>
          <Button
            type="submit"
            loading={update.isPending}
            loadingText="Сохраняем…"
            disabled={!isDirty}
            className="sm:flex-[2]"
          >
            <Save className="w-4 h-4" />
            Сохранить изменения
          </Button>
        </div>
      </form>

      {/* Email — read-only плашка */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900 break-all">{me.email}</p>
          </div>
          <span className="text-xs text-gray-400">Нельзя изменить</span>
        </div>
      </div>
    </div>
  );
}
