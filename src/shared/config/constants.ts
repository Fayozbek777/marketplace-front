export const CATEGORIES = [
  { value: "electronics", label: "Электроника" },
  { value: "auto", label: "Авто" },
  { value: "realty", label: "Недвижимость" },
  { value: "clothes", label: "Одежда" },
  { value: "work", label: "Работа" },
  { value: "services", label: "Услуги" },
  { value: "animals", label: "Животные" },
  { value: "other", label: "Другое" },
] as const;

export const CITIES = [
  { value: "almaty", label: "Алматы" },
  { value: "astana", label: "Астана" },
  { value: "shymkent", label: "Шымкент" },
  { value: "karaganda", label: "Караганда" },
] as const;

export const PER_PAGE = 12;
export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE_MB = 5;

export const LISTING_STATUSES = [
  { value: "active", label: "Активно" },
  { value: "sold", label: "Продано" },
  { value: "archived", label: "В архиве" },
] as const;

export const PROMOTION_PLANS = [
  { id: "basic", name: "Basic", days: 3, price: 500 },
  { id: "standard", name: "Standard", days: 7, price: 1000 },
  { id: "premium", name: "Premium", days: 14, price: 2000 },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];
export type City = (typeof CITIES)[number]["value"];
export type ListingStatus = (typeof LISTING_STATUSES)[number]["value"];
export type PromotionPlanId = (typeof PROMOTION_PLANS)[number]["id"];
