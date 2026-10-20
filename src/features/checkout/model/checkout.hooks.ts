import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as checkoutApi from "../api/checkout.api";
import type { CreatePaymentRequest } from "../types/checkout.type";

// PLANS
export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: checkoutApi.getPlans,
    staleTime: 10 * 60 * 1000,
  });
}

// PAYMENT — создание (фейк-оплата)
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePaymentRequest) => checkoutApi.createPayment(dto),
    onSuccess: (payment) => {
      if (payment.status === "success") {
        toast.success("Оплата прошла! Объявление продвигается.");
        queryClient.invalidateQueries({
          queryKey: ["listings", payment.listing_id],
        });
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      } else {
        toast.error("Платёж отклонён. Попробуйте другую карту.");
      }
    },
    onError: () => {
      toast.error("Не удалось создать платёж");
    },
  });
}

// PAYMENT HISTORY

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: checkoutApi.getPaymentHistory,
  });
}

// PAYMENT DETAIL

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => checkoutApi.getPayment(id),
    enabled: !!id,
  });
}
