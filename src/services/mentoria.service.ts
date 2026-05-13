import { api, withMockFallback } from "./api";

export interface Mentoria {
  id: string;
  mentor: string;
  area: string;
  proximaSessao?: string;
}

const mock: Mentoria[] = [
  { id: "m-1", mentor: "Rafael Souza", area: "Captação", proximaSessao: "2026-05-15 10:00" },
  { id: "m-2", mentor: "Joana Lima", area: "Produto", proximaSessao: "2026-05-22 14:00" },
];

export const mentoriaService = {
  async list() {
    return withMockFallback(async () => (await api.get<Mentoria[]>("/mentorias")).data, () => mock);
  },
};
