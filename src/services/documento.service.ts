import { api, withMockFallback } from "./api";

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  atualizadoEm: string;
}

const mock: Documento[] = [
  { id: "d-1", nome: "Contrato Social.pdf", tipo: "Legal", atualizadoEm: "2026-04-12" },
  { id: "d-2", nome: "Pitch Deck v2.pdf", tipo: "Captação", atualizadoEm: "2026-05-01" },
  { id: "d-3", nome: "Cap Table.xlsx", tipo: "Financeiro", atualizadoEm: "2026-05-08" },
];

export const documentoService = {
  async list() {
    return withMockFallback(async () => (await api.get<Documento[]>("/documentos")).data, () => mock);
  },
};
