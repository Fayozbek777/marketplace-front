import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
    formState: { errors },
  } = useForm<CreateListingFormValues>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category_id: "",
      city: "",
    },
  });

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

  // плоский список категорий (родители + дети)
  const flatCategories =
    categories?.flatMap((c) => [
      { value: c.id, label: c.name },
      ...c.children.map((child) => ({
        value: child.id,
        label: `— ${child.name}`,
      })),
    ]) ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <Input
        label="Заголовок"
        placeholder="Например, iPhone 15 Pro"
        {...register("title")}
        error={errors.title?.message}
      />

      <Textarea
        label="Описание"
        placeholder="Подробное описание"
        rows={6}
        {...register("description")}
        error={errors.description?.message}
      />

      <Input
        label="Цена, ₸"
        type="number"
        placeholder="0"
        {...register("price")}
        error={errors.price?.message}
      />

      <Select
        label="Категория"
        placeholder={catLoading ? "Загрузка…" : "Выберите"}
        disabled={catLoading}
        options={flatCategories}
        {...register("category_id")}
        error={errors.category_id?.message}
      />

      <Select
        label="Город"
        placeholder="Выберите"
        options={CITIES.map((c) => ({ value: c.value, label: c.label }))}
        {...register("city")}
        error={errors.city?.message}
      />

      <Button type="submit" loading={create.isPending} className="w-full">
        Создать объявление
      </Button>
    </form>
  );
}
