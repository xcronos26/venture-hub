import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { documentoService } from "@/services/documento.service";

export const Route = createFileRoute("/_authenticated/documentos")({ component: DocumentosPage });

function DocumentosPage() {
  const { data } = useQuery({ queryKey: ["documentos"], queryFn: () => documentoService.list() });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documentos</h1>
        <p className="text-muted-foreground">Centralize os documentos da sua empresa.</p>
      </div>
      <div className="grid gap-3">
        {data?.map((d) => (
          <Card key={d.id} className="p-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{d.nome}</p>
              <p className="text-xs text-muted-foreground">{d.tipo} · atualizado em {d.atualizadoEm}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
