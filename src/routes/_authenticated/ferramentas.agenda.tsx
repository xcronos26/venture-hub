import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { agendaService, type TipoEvento } from "@/services/agenda.service";

export const Route = createFileRoute("/_authenticated/ferramentas/agenda")({ component: Page });

const tipoColor: Record<TipoEvento, string> = {
  mentoria: "bg-violet-500",
  reuniao: "bg-sky-500",
  prazo: "bg-amber-500",
};

function Page() {
  const [cursor, setCursor] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [novo, setNovo] = useState({ titulo: "", data: format(new Date(), "yyyy-MM-dd"), hora: "09:00", tipo: "reuniao" as TipoEvento });
  const qc = useQueryClient();
  const { data: events = [] } = useQuery({ queryKey: ["agenda"], queryFn: () => agendaService.list() });

  const adicionar = async () => {
    if (!novo.titulo) return;
    await agendaService.create(novo);
    qc.invalidateQueries({ queryKey: ["agenda"] });
    setOpen(false);
    setNovo({ ...novo, titulo: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm">Mentorias, reuniões e prazos.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Novo evento</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo evento</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título</Label><Input value={novo.titulo} onChange={(e) => setNovo({ ...novo, titulo: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Data</Label><Input type="date" value={novo.data} onChange={(e) => setNovo({ ...novo, data: e.target.value })} /></div>
                <div><Label>Hora</Label><Input type="time" value={novo.hora} onChange={(e) => setNovo({ ...novo, hora: e.target.value })} /></div>
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={novo.tipo} onValueChange={(v) => setNovo({ ...novo, tipo: v as TipoEvento })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mentoria">Mentoria</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="prazo">Prazo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={adicionar} className="w-full">Adicionar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="mes">
        <TabsList>
          <TabsTrigger value="mes">Mês</TabsTrigger>
          <TabsTrigger value="semana">Semana</TabsTrigger>
        </TabsList>
        <TabsContent value="mes">
          <MonthView cursor={cursor} setCursor={setCursor} events={events} />
        </TabsContent>
        <TabsContent value="semana">
          <WeekView cursor={cursor} setCursor={setCursor} events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MonthView({ cursor, setCursor, events }: { cursor: Date; setCursor: (d: Date) => void; events: any[] }) {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold capitalize">{format(cursor, "MMMM yyyy", { locale: ptBR })}</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-1">
        {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map((d) => <div key={d} className="text-center font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.data + "T00:00:00"), d));
          return (
            <div key={d.toISOString()} className={`min-h-[80px] rounded border p-1 text-xs ${isSameMonth(d, cursor) ? "" : "opacity-40"}`}>
              <div className="font-medium">{format(d, "d")}</div>
              <div className="space-y-0.5 mt-0.5">
                {dayEvents.map((e) => (
                  <div key={e.id} className={`px-1 py-0.5 rounded text-white text-[10px] truncate ${tipoColor[e.tipo as TipoEvento]}`}>
                    {e.hora} {e.titulo}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WeekView({ cursor, setCursor, events }: { cursor: Date; setCursor: (d: Date) => void; events: any[] }) {
  const start = startOfWeek(cursor, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Semana de {format(start, "dd/MM")}</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCursor(addDays(cursor, -7))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setCursor(addDays(cursor, 7))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.data + "T00:00:00"), d));
          return (
            <div key={d.toISOString()} className="min-h-[160px] border rounded p-2">
              <div className="text-xs font-medium mb-2 capitalize">{format(d, "EEE dd/MM", { locale: ptBR })}</div>
              <div className="space-y-1">
                {dayEvents.map((e) => (
                  <div key={e.id} className={`px-2 py-1 rounded text-white text-xs ${tipoColor[e.tipo as TipoEvento]}`}>
                    <div>{e.hora}</div>
                    <div className="truncate">{e.titulo}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
