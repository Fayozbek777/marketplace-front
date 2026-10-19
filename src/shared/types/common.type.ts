export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiErrorCode =
  | "unauthorized"
  | "validation_error"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "internal_error";

export type SortOrder = "created_at" | "-created_at" | "price" | "-price";
