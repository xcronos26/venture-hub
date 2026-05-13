import { api, withMockFallback } from "./api";

export interface Rodada {
  id: string;
  nome: string;
  valuation: number;
  meta: number;
  status: "aberta" | "fechada";
}

const mock: Rodada[] = [
  { id: "r-1", nome: "Pre-Seed", valuation: 5_000_000, meta: 500_000, status: "aberta" },
];

export const captacaoService = {
  async list() {
    return withMockFallback(async () => (await api.get<Rodada[]>("/captacao")).data, () => mock);
  },
};
