import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/ferramentas/planejamento")({ component: Page });

function Page() {
  const [missao, setMissao] = useState("");
  const [visao, setVisao] = useState("");
  const [objetivos, setObjetivos] = useState("");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Planejamento Estratégico</h1>
        <p className="text-muted-foreground">Defina rumo, visão e objetivos.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Visão geral</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Missão</Label><Input value={missao} onChange={(e) => setMissao(e.target.value)} /></div>
          <div className="space-y-2"><Label>Visão</Label><Input value={visao} onChange={(e) => setVisao(e.target.value)} /></div>
          <div className="space-y-2"><Label>Objetivos do trimestre</Label><Textarea rows={5} value={objetivos} onChange={(e) => setObjetivos(e.target.value)} /></div>
          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
