import { api, TOKEN_KEY, withMockFallback } from "./api";
import { mockUser } from "@/mocks";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  avatarUrl?: string | null;
  onboardingCompleto?: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return withMockFallback(
      async () => {
        const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
      },
      () => {
        const fake = { token: "mock-token-" + Date.now(), user: { ...mockUser, email } };
        localStorage.setItem(TOKEN_KEY, fake.token);
        return fake;
      },
    );
  },

  async signup(payload: { nome: string; email: string; password: string }): Promise<LoginResponse> {
    return withMockFallback(
      async () => {
        const { data } = await api.post<LoginResponse>("/auth/signup", payload);
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
      },
      () => {
        const fake = { token: "mock-token-" + Date.now(), user: { ...mockUser, ...payload } };
        localStorage.setItem(TOKEN_KEY, fake.token);
        return fake;
      },
    );
  },

  async forgotPassword(email: string): Promise<{ ok: true }> {
    return withMockFallback(
      async () => (await api.post("/auth/forgot-password", { email })).data,
      () => ({ ok: true as const }),
    );
  },

  async resetPassword(token: string, password: string): Promise<{ ok: true }> {
    return withMockFallback(
      async () => (await api.post("/auth/reset-password", { token, password })).data,
      () => ({ ok: true as const }),
    );
  },

  async me(): Promise<AuthUser> {
    return withMockFallback(
      async () => (await api.get<AuthUser>("/auth/me")).data,
      () => mockUser,
    );
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY);
  },
};
