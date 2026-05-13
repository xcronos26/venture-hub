import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/ferramentas/calculadora")({ component: Page });

function Page() {
  const [valuation, setValuation] = useState(5_000_000);
  const [percentual, setPercentual] = useState(15);
  const [meta, setMeta] = useState(750_000);

  const result = useMemo(() => {
    const captado = (valuation * percentual) / 100;
    const valorPorPonto = valuation / 100;
    const diluicao = percentual;
    const novoValuation = valuation;
    return { captado, valorPorPonto, diluicao, novoValuation, atingido: captado >= meta };
  }, [valuation, percentual, meta]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Calculadora de Captação</h1>
        <p className="text-muted-foreground">Simule rodadas em tempo real.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Parâmetros</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Valuation pré-money (R$)</Label>
              <Input type="number" value={valuation} onChange={(e) => setValuation(Number(e.target.value))} />
            </div>
            <div className="space-y-2"><Label>% oferecido</Label>
              <Input type="number" value={percentual} onChange={(e) => setPercentual(Number(e.target.value))} />
            </div>
            <div className="space-y-2"><Label>Meta de captação (R$)</Label>
              <Input type="number" value={meta} onChange={(e) => setMeta(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Resultado</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Valor captado: <strong>{fmt(result.captado)}</strong></p>
            <p>Valor por 1%: <strong>{fmt(result.valorPorPonto)}</strong></p>
            <p>Diluição dos fundadores: <strong>{result.diluicao}%</strong></p>
            <p>Novo valuation pós-money: <strong>{fmt(result.novoValuation + result.captado)}</strong></p>
            <p className={result.atingido ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
              {result.atingido ? "✓ Meta atingida" : `Faltam ${fmt(meta - result.captado)}`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
