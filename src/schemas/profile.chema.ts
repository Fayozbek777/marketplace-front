import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Некорректный номер")
    .or(z.literal(""))
    .optional(),
  city: z.string().max(50).or(z.literal("")).optional(),
  bio: z
    .string()
    .max(500, "Максимум 500 символов")
    .or(z.literal(""))
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
