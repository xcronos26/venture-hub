import { api, TOKEN_KEY } from "./api";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  avatarUrl?: string | null;
  onboardingCompleto?: boolean;
  // demais campos retornados pelo backend
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Normaliza diferentes formatos de resposta do backend para { token, user } */
function normalizeAuthResponse(data: any): LoginResponse {
  const token: string =
    data?.token ?? data?.access_token ?? data?.accessToken ?? data?.jwt ?? "";

  const rawUser = data?.user ?? data?.entrepreneur ?? data?.data?.user ?? data;
  const user: AuthUser = {
    id: String(rawUser?.id ?? rawUser?._id ?? ""),
    nome: rawUser?.nome ?? rawUser?.name ?? rawUser?.full_name ?? "",
    email: rawUser?.email ?? "",
    avatarUrl: rawUser?.avatarUrl ?? rawUser?.avatar_url ?? rawUser?.avatar ?? null,
    onboardingCompleto:
      rawUser?.onboardingCompleto ?? rawUser?.onboarding_completed ?? false,
    ...rawUser,
  };

  return { token, user };
}

function persistToken(token: string) {
  if (typeof window !== "undefined" && token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export const authService = {
  /** POST /entrepreneur/login */
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post("/entrepreneur/login", { email, password });
    const res = normalizeAuthResponse(data);
    persistToken(res.token);
    return res;
  },

  /** POST /entrepreneur/register */
  async signup(payload: { nome: string; email: string; password: string }): Promise<LoginResponse> {
    const { data } = await api.post("/entrepreneur/register", {
      name: payload.nome,
      nome: payload.nome,
      email: payload.email,
      password: payload.password,
    });
    const res = normalizeAuthResponse(data);
    persistToken(res.token);
    return res;
  },

  /** POST /entrepreneur/recover */
  async forgotPassword(email: string): Promise<{ ok: true }> {
    await api.post("/entrepreneur/recover", { email });
    return { ok: true };
  },

  /** POST /entrepreneur/change-password */
  async resetPassword(payload: { token?: string; currentPassword?: string; password: string }): Promise<{ ok: true }> {
    await api.post("/entrepreneur/change-password", payload);
    return { ok: true };
  },

  /** POST /entrepreneur/resend-verification */
  async resendVerification(email: string): Promise<{ ok: true }> {
    await api.post("/entrepreneur/resend-verification", { email });
    return { ok: true };
  },

  /** GET /entrepreneur/me */
  async me(): Promise<AuthUser> {
    const { data } = await api.get("/entrepreneur/me");
    const rawUser = data?.user ?? data?.entrepreneur ?? data;
    return {
      id: String(rawUser?.id ?? rawUser?._id ?? ""),
      nome: rawUser?.nome ?? rawUser?.name ?? rawUser?.full_name ?? "",
      email: rawUser?.email ?? "",
      avatarUrl: rawUser?.avatarUrl ?? rawUser?.avatar_url ?? rawUser?.avatar ?? null,
      onboardingCompleto:
        rawUser?.onboardingCompleto ?? rawUser?.onboarding_completed ?? false,
      ...rawUser,
    };
  },

  /** POST /entrepreneur/logout */
  async logout(): Promise<void> {
    try {
      await api.post("/entrepreneur/logout");
    } catch {
      // ignora — limpamos o token localmente de qualquer jeito
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  },

  isAuthenticated(): boolean {
    return typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY);
  },
};
