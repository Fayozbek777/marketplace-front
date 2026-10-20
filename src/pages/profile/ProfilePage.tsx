import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    formState: { errors },
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

  if (isLoading)
    return (
      <div className="p-4">
        <Skeleton className="h-64" />
      </div>
    );
  if (!me) return null;

  const onSubmit = (v: ProfileFormValues) =>
    update.mutate({
      name: v.name,
      phone: v.phone || null,
      city: v.city || null,
      bio: v.bio || null,
    });

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <Button variant="outline" onClick={() => logout.mutate()}>
          Выйти
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-medium">{me.email}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Имя" {...register("name")} error={errors.name?.message} />
        <Input
          label="Телефон"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <Input
          label="Город"
          {...register("city")}
          error={errors.city?.message}
        />
        <Textarea
          label="О себе"
          rows={4}
          {...register("bio")}
          error={errors.bio?.message}
        />
        <Button type="submit" loading={update.isPending} className="w-full">
          Сохранить
        </Button>
      </form>
    </div>
  );
}
