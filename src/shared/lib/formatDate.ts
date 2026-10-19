import { formatDistanceToNow, format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ru });
}

export function formatFull(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d MMMM yyyy, HH:mm", { locale: ru });
}
