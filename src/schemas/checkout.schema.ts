import { z } from "zod";

/** Алгоритм Луна */
function luhn(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alt = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }

  return sum % 10 === 0;
}

export const cardSchema = z.object({
  number: z
    .string()
    .transform((v) => v.replace(/\s/g, "")) // убираем пробелы
    .refine((v) => /^\d{13,19}$/.test(v), "Некорректный номер")
    .refine(luhn, "Номер не проходит проверку Луна"),

  exp: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Формат MM/YY")
    .refine((v) => {
      const [mm, yy] = v.split("/").map(Number);
      const now = new Date();
      const exp = new Date(2000 + yy, mm, 0); // последний день месяца
      return exp >= now;
    }, "Карта просрочена"),

  cvv: z.string().regex(/^\d{3,4}$/, "CVV: 3–4 цифры"),

  holder: z
    .string()
    .min(2, "Укажите имя на карте")
    .max(50)
    .transform((v) => v.toUpperCase()),
});

export const checkoutSchema = z.object({
  plan_id: z.string().uuid("Выберите тариф"),
  card: cardSchema,
});

export type CardFormValues = z.infer<typeof cardSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
