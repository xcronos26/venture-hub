import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ferramentas/pitch-deck")({ component: Page });

const SECOES = [
  "Problema", "Solução", "Mercado", "Produto", "Modelo de Negócio",
  "Tração", "Time", "Financeiro", "Captação",
];

function Page() {
  const [valores, setValores] = useState<Record<string, string>>({});
  const progresso = useMemo(() => {
    const preenchidos = SECOES.filter((s) => (valores[s] ?? "").trim().length > 20).length;
    return (preenchidos / SECOES.length) * 100;
  }, [valores]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerador de Pitch Deck</h1>
          <p className="text-muted-foreground">Preencha cada seção essencial.</p>
        </div>
        <Button onClick={() => toast.success("Exportação simulada")}>Exportar</Button>
      </div>
      <Progress value={progresso} />
      <div className="grid gap-4 md:grid-cols-2">
        {SECOES.map((s) => (
          <Card key={s}>
            <CardHeader><CardTitle className="text-base">{s}</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={valores[s] ?? ""}
                onChange={(e) => setValores({ ...valores, [s]: e.target.value })}
                placeholder={`Descreva: ${s}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
