import { api, withMockFallback } from "./api";

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  descricao?: string;
  ramo?: string;
  diferencial?: string;
  publico?: "B2B" | "B2C" | "B2G";
}

const mock: Empresa = {
  id: "e-1",
  razaoSocial: "Empresa Exemplo LTDA",
  nomeFantasia: "Exemplo",
  cnpj: "00.000.000/0001-00",
  descricao: "SaaS de gestão para empreendedores e startups.",
  ramo: "Tecnologia",
  diferencial: "Onboarding conversacional + multi-tenant.",
  publico: "B2B",
};

export const empresaService = {
  async get() {
    return withMockFallback(async () => (await api.get<Empresa>("/empresa")).data, () => mock);
  },
  async update(data: Partial<Empresa>) {
    return withMockFallback(
      async () => (await api.put<Empresa>("/empresa", data)).data,
      () => ({ ...mock, ...data }),
    );
  },
};
