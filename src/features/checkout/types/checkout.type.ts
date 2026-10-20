export type PaymentStatus = "success" | "failed";

export interface Plan {
  id: string;
  code: string;
  name: string;
  days: number;
  price: number;
  is_top: boolean;
}

export interface CarDTO {
  number: string;
  exp: string;
  cvv: string;
  holder: string;
}

export interface CreatePaymentRequest {
  listing_id: string;
  plan_id: string;
  card: CarDTO;
}

export interface Payment {
  id: string;
  user_id: string;
  listing_id: string;
  plan_id: string;
  amount: string;
  status: PaymentStatus;
  provider_tx_id: string;
  created_at: string;
}
