import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/aprendizado")({ component: AprendizadoPage });

const trilhas = [
  { titulo: "Fundamentos para Founders", desc: "Os primeiros 90 dias de uma startup.", aulas: 12 },
  { titulo: "Captação 101", desc: "Como preparar sua primeira rodada.", aulas: 8 },
  { titulo: "Vendas B2B", desc: "Construa um motor de receita previsível.", aulas: 10 },
];

function AprendizadoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aprendizado</h1>
        <p className="text-muted-foreground">Trilhas e conteúdos para evoluir sua startup.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {trilhas.map((t) => (
          <Card key={t.titulo}>
            <CardHeader><CardTitle>{t.titulo}</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-muted-foreground">{t.desc}</p>
              <p>{t.aulas} aulas</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
