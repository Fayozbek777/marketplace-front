import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cardSchema, type CardFormValues } from "@/schemas/checkout.schema";
import { usePlans, useCreatePayment } from "../model/checkout.hooks";
import { formatPrice } from "@/shared/lib/formatPrice";

interface Props {
  listingId: string;
  onSuccess?: (status: "success" | "failed") => void;
}

export function CheckoutForm({ listingId, onSuccess }: Props) {
  const { data: plans, isLoading } = usePlans();
  const createPayment = useCreatePayment();
  const [planId, setPlanId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
  });

  const onSubmit = (card: CardFormValues) => {
    if (!planId) return;
    createPayment.mutate(
      { listing_id: listingId, plan_id: planId, card },
      { onSuccess: (p) => onSuccess?.(p.status) },
    );
  };

  if (isLoading) return <p className="text-gray-500">Загрузка тарифов…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Тарифы */}
      <div className="space-y-2">
        <h3 className="font-semibold">Тариф</h3>
        {plans?.map((p) => (
          <label
            key={p.id}
            className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer ${
              planId === p.id ? "border-brand-500 bg-brand-50" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="plan"
                checked={planId === p.id}
                onChange={() => setPlanId(p.id)}
              />
              <span>
                {p.name} · {p.days} дней
              </span>
            </span>
            <span className="font-bold">{formatPrice(p.price)}</span>
          </label>
        ))}
      </div>

      {/* Карта */}
      <div>
        <label className="block mb-1 text-sm font-medium">Номер карты</label>
        <input
          {...register("number")}
          placeholder="4242 4242 4242 4242"
          className="w-full h-10 px-3 border rounded-lg"
        />
        {errors.number && (
          <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block mb-1 text-sm font-medium">Срок</label>
          <input
            {...register("exp")}
            placeholder="MM/YY"
            className="w-full h-10 px-3 border rounded-lg"
          />
          {errors.exp && (
            <p className="text-red-500 text-sm mt-1">{errors.exp.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">CVV</label>
          <input
            {...register("cvv")}
            placeholder="123"
            className="w-full h-10 px-3 border rounded-lg"
          />
          {errors.cvv && (
            <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Имя на карте</label>
        <input
          {...register("holder")}
          placeholder="IVAN IVANOV"
          className="w-full h-10 px-3 border rounded-lg uppercase"
        />
        {errors.holder && (
          <p className="text-red-500 text-sm mt-1">{errors.holder.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!planId || createPayment.isPending}
        className="w-full h-10 bg-brand-600 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {createPayment.isPending ? "Обработка…" : "Оплатить"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Демо: 4242 4242 4242 4242 — success, 4000 0000 0000 0002 — declined
      </p>
    </form>
  );
}
