import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(120, "Максимум 120 символов"),
  description: z
    .string()
    .min(10, "Минимум 10 символов")
    .max(5000, "Максимум 5000 символов"),
  price: z.coerce
    .number({ invalid_type_error: "Введите число" })
    .min(0, "Цена не может быть отрицательной")
    .max(100_000_000, "Слишком большая цена"),
  category_id: z.string().uuid("Выберите категорию"),
  city: z.string().min(1, "Выберите город"),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingFormValues = z.infer<typeof createListingSchema>;
export type UpdateListingFormValues = z.infer<typeof updateListingSchema>;
