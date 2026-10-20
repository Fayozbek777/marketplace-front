import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Lock,
  User,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Загрузка тарифов…
      </div>
    );
  }

  const selectedPlan = plans?.find((p) => p.id === planId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Оплата размещения</h1>
        <p className="text-sm text-gray-500 mt-1">
          Выберите тариф и оплатите картой — объявление станет активным сразу
        </p>
      </div>

      {/* ===== Тарифы ===== */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Тариф</h3>
        <div className="space-y-2">
          {plans?.map((p, i) => {
            const selected = planId === p.id;
            const popular = i === 1; // второй тариф подсвечиваем как «Популярный»
            return (
              <label
                key={p.id}
                className={`relative flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                  selected
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      selected ? "border-brand-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="plan"
                    checked={selected}
                    onChange={() => setPlanId(p.id)}
                    className="sr-only"
                  />
                  <span className="flex flex-col">
                    <span className="font-medium text-gray-900 flex items-center gap-2">
                      {p.name}
                      {popular && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold uppercase tracking-wide">
                          Популярный
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {p.days} дней размещения
                    </span>
                  </span>
                </span>
                <span className="font-bold text-gray-900 whitespace-nowrap">
                  {formatPrice(p.price)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ===== Карта ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Данные карты</h3>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Защищённое соединение
          </span>
        </div>

        {/* Номер карты */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Номер карты
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              {...register("number")}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              autoComplete="cc-number"
              className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition font-mono tracking-wide"
            />
          </div>
          {errors.number && (
            <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
          )}
        </div>

        {/* Срок + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Срок
            </label>
            <input
              {...register("exp")}
              placeholder="MM/YY"
              inputMode="numeric"
              autoComplete="cc-exp"
              className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition font-mono"
            />
            {errors.exp && (
              <p className="text-red-500 text-sm mt-1">{errors.exp.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              CVV
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                {...register("cvv")}
                placeholder="•••"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition font-mono"
              />
            </div>
            {errors.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        {/* Имя */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Имя на карте
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              {...register("holder")}
              placeholder="IVAN IVANOV"
              autoComplete="cc-name"
              className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition uppercase tracking-wide"
            />
          </div>
          {errors.holder && (
            <p className="text-red-500 text-sm mt-1">{errors.holder.message}</p>
          )}
        </div>
      </div>

      {/* ===== Итог + кнопка ===== */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {selectedPlan ? selectedPlan.name : "Тариф не выбран"}
          </span>
          <span className="font-semibold text-gray-900">
            {selectedPlan ? formatPrice(selectedPlan.price) : "—"}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
          <span className="font-medium text-gray-900">Итого</span>
          <span className="text-lg font-bold text-brand-600">
            {selectedPlan ? formatPrice(selectedPlan.price) : "—"}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!planId || createPayment.isPending}
        className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
      >
        {createPayment.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Обработка…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Оплатить {selectedPlan ? formatPrice(selectedPlan.price) : ""}
          </>
        )}
      </button>

      {/* Демо-подсказка */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border border-blue-200 bg-blue-50 p-3"
      >
        <p className="text-xs text-blue-900 font-medium mb-1">🧪 Демо-режим</p>
        <ul className="text-xs text-blue-800 space-y-0.5 font-mono">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>4242 4242 4242 4242 — успешно</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 flex items-center justify-center text-red-500 flex-shrink-0">
              ✕
            </span>
            <span>4000 0000 0000 0002 — отклонено</span>
          </li>
        </ul>
      </motion.div>
    </form>
  );
}
