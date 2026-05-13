import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { captacaoService } from "@/services/captacao.service";

export const Route = createFileRoute("/_authenticated/captacao")({ component: CaptacaoPage });

function CaptacaoPage() {
  const { data } = useQuery({ queryKey: ["captacao"], queryFn: () => captacaoService.list() });
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Captação</h1>
          <p className="text-muted-foreground">Suas rodadas de investimento.</p>
        </div>
        <Button asChild><Link to="/ferramentas/calculadora">Simular rodada</Link></Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{r.nome}</CardTitle>
              <Badge variant={r.status === "aberta" ? "default" : "secondary"}>{r.status}</Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Valuation: <strong>{fmt(r.valuation)}</strong></p>
              <p>Meta: <strong>{fmt(r.meta)}</strong></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
