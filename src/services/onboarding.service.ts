import { api, withMockFallback } from "./api";
import { mockCnpj } from "@/mocks";

export interface OnboardingData {
  cnpj?: string;
  empresa?: ReturnType<typeof mockCnpj>;
  cpfResponsavel?: string;
  descricao?: string;
  ramo?: string;
  diferencial?: string;
  publico?: "B2B" | "B2C" | "B2G";
  step?: number;
  completo?: boolean;
}

const LS_KEY = "tb:onboarding";

const validateCpf = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  const calc = (slice: number) => {
    let sum = 0;
    for (let i = 0; i < slice; i++) sum += parseInt(digits[i]) * (slice + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === parseInt(digits[9]) && calc(10) === parseInt(digits[10]);
};

const validateCnpj = (cnpj: string) => cnpj.replace(/\D/g, "").length === 14;

export const onboardingService = {
  validateCpf,
  validateCnpj,

  async consultarCnpj(cnpj: string) {
    return withMockFallback(
      async () => (await api.get(`/cnpj/${cnpj.replace(/\D/g, "")}`)).data,
      () => mockCnpj(cnpj),
    );
  },

  async load(): Promise<OnboardingData> {
    return withMockFallback(
      async () => (await api.get<OnboardingData>("/onboarding")).data,
      () => {
        const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
        return raw ? (JSON.parse(raw) as OnboardingData) : {};
      },
    );
  },

  async save(data: OnboardingData): Promise<OnboardingData> {
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(data));
    return withMockFallback(
      async () => (await api.put<OnboardingData>("/onboarding", data)).data,
      () => data,
    );
  },

  async complete(): Promise<{ ok: true }> {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const d = JSON.parse(raw) as OnboardingData;
        localStorage.setItem(LS_KEY, JSON.stringify({ ...d, completo: true }));
      }
    }
    return withMockFallback(
      async () => (await api.post("/onboarding/complete")).data,
      () => ({ ok: true as const }),
    );
  },

  isComplete(): boolean {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    try {
      return !!(JSON.parse(raw) as OnboardingData).completo;
    } catch {
      return false;
    }
  },
};
