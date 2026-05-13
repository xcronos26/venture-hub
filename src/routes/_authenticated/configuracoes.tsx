import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/configuracoes")({ component: ConfiguracoesPage });

function ConfiguracoesPage() {
  const [nome, setNome] = useState("");
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Preferências da conta.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Conta</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome de exibição</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea placeholder="Conte um pouco sobre você" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
