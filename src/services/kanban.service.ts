import { api, withMockFallback } from "./api";
import { mockKanban } from "@/mocks";

export type Prioridade = "baixa" | "media" | "alta";

export interface KanbanCard {
  id: string;
  columnId: string;
  titulo: string;
  descricao?: string;
  responsavel?: string;
  prazo?: string;
  prioridade: Prioridade;
  etiquetas: { nome: string; cor: string }[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  cards: KanbanCard[];
}

const LS = "tb:kanban";
const readLocal = (): KanbanBoard => {
  if (typeof window === "undefined") return mockKanban;
  const raw = localStorage.getItem(LS);
  return raw ? JSON.parse(raw) : mockKanban;
};
const writeLocal = (b: KanbanBoard) => {
  if (typeof window !== "undefined") localStorage.setItem(LS, JSON.stringify(b));
};

export const kanbanService = {
  async load(): Promise<KanbanBoard> {
    return withMockFallback(
      async () => (await api.get<KanbanBoard>("/kanban")).data,
      () => readLocal(),
    );
  },
  async save(board: KanbanBoard): Promise<KanbanBoard> {
    writeLocal(board);
    return withMockFallback(
      async () => (await api.put<KanbanBoard>("/kanban", board)).data,
      () => board,
    );
  },
};
