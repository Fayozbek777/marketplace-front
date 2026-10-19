export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("ru-RU").format(num) + " ₸";
}

export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} млн ₸`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} тыс ₸`;
  return `${value} ₸`;
}
