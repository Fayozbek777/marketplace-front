import { apiClient } from "@/shared/api/client";
import { endpoints } from "@/shared/api/endpoints";
import type {
  Plan,
  CreatePaymentRequest,
  Payment,
} from "../types/checkout.type";

export async function getPlans(): Promise<Plan[]> {
  const { data } = await apiClient.get<Plan[]>(endpoints.plans.list);
  return data;
}

export async function createPayment(
  dto: CreatePaymentRequest,
): Promise<Payment> {
  const { data } = await apiClient.post<Payment>(
    endpoints.payments.create,
    dto,
  );
  return data;
}

export async function getPayment(id: string): Promise<Payment> {
  const { data } = await apiClient.get<Payment>(endpoints.payments.byId(id));
  return data;
}

export async function getPaymentHistory(): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>(endpoints.payments.history);
  return data;
}
