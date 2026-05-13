import axios, { AxiosError, AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.tokenbuild.com.br";

// Chave de storage conforme padrão do backend
export const TOKEN_KEY = "entrepreneur_loor_token";
export const TENANT_KEY = "tb:tenant";

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    const tenant = localStorage.getItem(TENANT_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (tenant) config.headers["X-Tenant"] = tenant;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(err);
  },
);

/** Helper: tenta API, em caso de erro de rede usa fallback de mock (apenas em DEV). */
export async function withMockFallback<T>(call: () => Promise<T>, mock: () => T | Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[api] usando mock fallback:", (err as Error).message);
      return await mock();
    }
    throw err;
  }
}
