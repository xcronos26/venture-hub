import { api, withMockFallback } from "./api";
import { mockEvents } from "@/mocks";

export type TipoEvento = "mentoria" | "reuniao" | "prazo";

export interface AgendaEvento {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  tipo: TipoEvento;
}

const LS = "tb:agenda";
const readLocal = (): AgendaEvento[] => {
  if (typeof window === "undefined") return mockEvents;
  const raw = localStorage.getItem(LS);
  return raw ? JSON.parse(raw) : mockEvents;
};
const writeLocal = (l: AgendaEvento[]) => {
  if (typeof window !== "undefined") localStorage.setItem(LS, JSON.stringify(l));
};

export const agendaService = {
  async list() {
    return withMockFallback(async () => (await api.get<AgendaEvento[]>("/agenda")).data, readLocal);
  },
  async create(ev: Omit<AgendaEvento, "id">) {
    const novo: AgendaEvento = { ...ev, id: "e-" + Date.now() };
    const list = [...readLocal(), novo];
    writeLocal(list);
    return withMockFallback(async () => (await api.post<AgendaEvento>("/agenda", novo)).data, () => novo);
  },
  async remove(id: string) {
    writeLocal(readLocal().filter((e) => e.id !== id));
    return withMockFallback(async () => (await api.delete(`/agenda/${id}`)).data, () => ({ ok: true }));
  },
};
