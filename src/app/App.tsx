import { cn } from "@/shared/lib/cn";
import { formatPrice } from "@/shared/lib/formatPrice";
import { formatRelative } from "@/shared/lib/formatDate";
import { CATEGORIES, CITIES } from "@/shared/config/constants";
import { storage } from "@/shared/lib/storage";

export default function App() {
  storage.set("test", { hello: "world" });
  const test = storage.get<{ hello: string }>("test");

  return (
    <div className="p-8 space-y-4">
      <h1 className={cn("text-2xl font-bold", "text-brand-600")}>
        Этап 0 — база готова ✓
      </h1>

      <p>
        <b>cn:</b>
        <code className={cn("px-2 py-1 rounded", "bg-blue-100")}>класс</code>
      </p>
      <p>
        <b>formatPrice:</b> {formatPrice(150000)}
      </p>
      <p>
        <b>formatRelative:</b> {formatRelative(new Date(Date.now() - 3600_000))}
      </p>
      <p>
        <b>CATEGORIES:</b> {CATEGORIES.map((c) => c.label).join(", ")}
      </p>
      <p>
        <b>CITIES:</b> {CITIES.map((c) => c.label).join(", ")}
      </p>
      <p>
        <b>storage:</b> {JSON.stringify(test)}
      </p>
    </div>
  );
}
