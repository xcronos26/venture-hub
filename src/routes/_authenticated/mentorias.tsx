import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mentoriaService } from "@/services/mentoria.service";

export const Route = createFileRoute("/_authenticated/mentorias")({ component: MentoriasPage });

function MentoriasPage() {
  const { data } = useQuery({ queryKey: ["mentorias"], queryFn: () => mentoriaService.list() });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mentorias</h1>
        <p className="text-muted-foreground">Acompanhe suas mentorias agendadas.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((m) => (
          <Card key={m.id}>
            <CardHeader><CardTitle>{m.mentor}</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>Área: <strong>{m.area}</strong></p>
              <p>Próxima sessão: {m.proximaSessao}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
