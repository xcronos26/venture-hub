import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kanbanService, type KanbanBoard, type KanbanCard, type Prioridade } from "@/services/kanban.service";

export const Route = createFileRoute("/_authenticated/ferramentas/kanban")({ component: KanbanPage });

const priorityColor: Record<Prioridade, string> = {
  baixa: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  media: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  alta: "bg-red-500/15 text-red-700 dark:text-red-300",
};

function KanbanPage() {
  const [board, setBoard] = useState<KanbanBoard>({ columns: [], cards: [] });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filterResp, setFilterResp] = useState("");
  const [filterPri, setFilterPri] = useState<string>("all");
  const [openCard, setOpenCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    kanbanService.load().then(setBoard);
  }, []);

  const persist = (next: KanbanBoard) => {
    setBoard(next);
    void kanbanService.save(next);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const cardId = e.active.id as string;
    const overId = e.over?.id as string | undefined;
    if (!overId) return;
    const targetCol = board.columns.find((c) => c.id === overId);
    if (!targetCol) return;
    persist({
      ...board,
      cards: board.cards.map((c) => (c.id === cardId ? { ...c, columnId: overId } : c)),
    });
  };

  const addColumn = () => {
    const title = prompt("Nome da coluna:");
    if (!title) return;
    persist({
      ...board,
      columns: [...board.columns, { id: "col-" + Date.now(), title, order: board.columns.length }],
    });
  };

  const addCard = (columnId: string) => {
    const titulo = prompt("Título do card:");
    if (!titulo) return;
    persist({
      ...board,
      cards: [
        ...board.cards,
        {
          id: "c-" + Date.now(),
          columnId,
          titulo,
          prioridade: "media",
          etiquetas: [],
        },
      ],
    });
  };

  const removeColumn = (id: string) => {
    persist({
      columns: board.columns.filter((c) => c.id !== id),
      cards: board.cards.filter((c) => c.columnId !== id),
    });
  };

  const filtered = useMemo(
    () =>
      board.cards.filter(
        (c) =>
          (!filterResp || c.responsavel?.toLowerCase().includes(filterResp.toLowerCase())) &&
          (filterPri === "all" || c.prioridade === filterPri),
      ),
    [board.cards, filterResp, filterPri],
  );

  const activeCard = activeId ? board.cards.find((c) => c.id === activeId) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kanban</h1>
          <p className="text-muted-foreground text-sm">Arraste cards entre colunas.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Filtrar responsável" value={filterResp} onChange={(e) => setFilterResp(e.target.value)} className="w-40" />
          <Select value={filterPri} onValueChange={setFilterPri}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas prioridades</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addColumn}><Plus className="h-4 w-4 mr-1" />Coluna</Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((col) => {
            const colCards = filtered.filter((c) => c.columnId === col.id);
            return (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                count={colCards.length}
                onAddCard={() => addCard(col.id)}
                onRemove={() => removeColumn(col.id)}
              >
                {colCards.map((card) => (
                  <DraggableCard key={card.id} card={card} onClick={() => setOpenCard(card)} />
                ))}
              </Column>
            );
          })}
        </div>
        <DragOverlay>{activeCard && <CardView card={activeCard} dragging />}</DragOverlay>
      </DndContext>

      <Dialog open={!!openCard} onOpenChange={(o) => !o && setOpenCard(null)}>
        <DialogContent>
          {openCard && (
            <>
              <DialogHeader>
                <DialogTitle>{openCard.titulo}</DialogTitle>
                <DialogDescription>{openCard.descricao || "Sem descrição"}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p><strong>Responsável:</strong> {openCard.responsavel || "—"}</p>
                <p><strong>Prazo:</strong> {openCard.prazo || "—"}</p>
                <div className="flex items-center gap-2">
                  <strong>Prioridade:</strong>
                  <Badge className={priorityColor[openCard.prioridade]}>{openCard.prioridade}</Badge>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {openCard.etiquetas.map((e) => (
                    <Badge key={e.nome} style={{ backgroundColor: e.cor, color: "white" }}>{e.nome}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Column({
  id,
  title,
  count,
  children,
  onAddCard,
  onRemove,
}: {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
  onAddCard: () => void;
  onRemove: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="w-72 shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <button onClick={onRemove} aria-label="Remover coluna" className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg border bg-muted/30 p-2 space-y-2 min-h-[200px] transition-colors ${
          isOver ? "border-primary bg-primary/5" : ""
        }`}
      >
        {children}
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onAddCard}>
          <Plus className="h-4 w-4 mr-1" /> Novo card
        </Button>
      </div>
    </div>
  );
}

function DraggableCard({ card, onClick }: { card: KanbanCard; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={isDragging ? "opacity-30" : ""}
    >
      <CardView card={card} />
    </div>
  );
}

function CardView({ card, dragging }: { card: KanbanCard; dragging?: boolean }) {
  return (
    <Card className={`p-3 cursor-grab active:cursor-grabbing ${dragging ? "shadow-2xl rotate-2" : ""}`}>
      <p className="font-medium text-sm">{card.titulo}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{card.responsavel || "—"}</span>
        <Badge className={priorityColor[card.prioridade]} variant="secondary">{card.prioridade}</Badge>
      </div>
      {card.etiquetas.length > 0 && (
        <div className="mt-2 flex gap-1 flex-wrap">
          {card.etiquetas.map((e) => (
            <span key={e.nome} className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: e.cor }}>
              {e.nome}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

// Para silenciar lints que pediriam estes imports (Dialog imports usados acima)
void Label; void Textarea;
