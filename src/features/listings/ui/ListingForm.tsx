import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Tag, FileText, Wallet, LayoutGrid } from "lucide-react";
import {
  createListingSchema,
  type CreateListingFormValues,
} from "@/schemas/listing.schema";
import { useCreateListing } from "../model/listings.hooks";
import { useCategories } from "@/features/categoires";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select } from "@/shared/ui/Select";
import { Button } from "@/shared/ui/Button";
import { CITIES } from "@/shared/config/constants";

export function ListingForm() {
  const navigate = useNavigate();
  const create = useCreateListing();
  const { data: categories, isLoading: catLoading } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateListingFormValues>({
    resolver: zodResolver(createListingSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category_id: "",
      city: "",
    },
  });

  const description = useWatch({ control, name: "description" }) ?? "";

  const onSubmit = (values: CreateListingFormValues) => {
    create.mutate(
      {
        title: values.title,
        description: values.description,
        price: String(values.price),
        category_id: values.category_id,
        city: values.city,
      },
      { onSuccess: (data) => navigate(`/listings/${data.id}`) },
    );
  };

  const flatCategories = useMemo(
    () =>
      categories?.flatMap((c) => [
        { value: c.id, label: c.name },
        ...c.children.map((child) => ({
          value: child.id,
          label: `— ${child.name}`,
        })),
      ]) ?? [],
    [categories],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Новое объявление</h1>
        <p className="text-sm text-gray-500 mt-1">
          Заполните информацию о товаре — это займёт минуту
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
          <Tag className="w-4 h-4 text-brand-600" />
          Основное
        </div>

        <Input
          label="Заголовок"
          placeholder="Например, iPhone 15 Pro"
          leftIcon={<Tag className="w-4 h-4" />}
          required
          {...register("title")}
          error={errors.title?.message}
        />

        <Textarea
          label="Описание"
          placeholder="Опишите состояние, характеристики, комплектность…"
          rows={6}
          maxLength={2000}
          showCount
          value={description}
          hint="Чем подробнее — тем больше откликов"
          {...register("description")}
          error={errors.description?.message}
        />

        <Input
          label="Цена, ₸"
          type="number"
          inputMode="numeric"
          placeholder="0"
          leftIcon={<Wallet className="w-4 h-4" />}
          required
          {...register("price")}
          error={errors.price?.message}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
          <LayoutGrid className="w-4 h-4 text-brand-600" />
          Местоположение
        </div>

        <Select
          label="Категория"
          placeholder={catLoading ? "Загрузка…" : "Выберите"}
          disabled={catLoading}
          required
          options={flatCategories}
          {...register("category_id")}
          error={errors.category_id?.message}
        />

        <Select
          label="Город"
          placeholder="Выберите"
          required
          options={CITIES.map((c) => ({ value: c.value, label: c.label }))}
          {...register("city")}
          error={errors.city?.message}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="sm:flex-1"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          loading={create.isPending}
          loadingText="Публикуем…"
          className="sm:flex-[2]"
        >
          <FileText className="w-4 h-4" />
          Создать объявление
        </Button>
      </div>
    </form>
  );
}
