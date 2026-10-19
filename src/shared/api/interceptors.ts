import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import { storage } from "@/shared/lib/storage";

interface TokenPair {
  access: string;
  refresh: string;
}

const TOKEN_KEY = "auth_tokens";

export function getTokens(): TokenPair | null {
  return storage.get<TokenPair>(TOKEN_KEY);
}

export function setTokens(tokens: TokenPair): void {
  storage.set(TOKEN_KEY, tokens);
}

export function clearTokens(): void {
  storage.remove(TOKEN_KEY);
}

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

function processQueue(newAccess: string) {
  pendingQueue.forEach((cb) => cb(newAccess));
  pendingQueue = [];
}

//  Bearer
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

//  Res: 401 -> refresh -> retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const url = original?.url ?? "";
    const isAuthEndpoint =
      url.includes(endpoints.auth.login) ||
      url.includes(endpoints.auth.register) ||
      url.includes(endpoints.auth.refresh);

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      const tokens = getTokens();
      if (!tokens?.refresh) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newAccess) => {
            original.headers.Authorization = `Bearer ${newAccess}`;
            resolve(apiClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post<{
          access: string;
          refresh: string;
        }>(endpoints.auth.refresh, { refresh: tokens.refresh });

        setTokens({ access: data.access, refresh: data.refresh });
        processQueue(data.access);

        original.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(original);
      } catch (refreshError) {
        clearTokens();
        pendingQueue = [];
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
