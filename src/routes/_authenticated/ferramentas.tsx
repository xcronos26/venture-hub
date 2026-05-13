import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { KanbanSquare, Calculator, FileText, Calendar, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ferramentas")({ component: FerramentasLayout });

const tools = [
  { url: "/ferramentas/kanban", title: "Kanban", desc: "Gerencie projetos com cards e colunas.", icon: KanbanSquare },
  { url: "/ferramentas/planejamento", title: "Planejamento Estratégico", desc: "Defina objetivos e metas.", icon: Target },
  { url: "/ferramentas/calculadora", title: "Calculadora de Captação", desc: "Simule rodadas e diluição.", icon: Calculator },
  { url: "/ferramentas/pitch-deck", title: "Gerador de Pitch Deck", desc: "Estruture seu deck por seções.", icon: FileText },
  { url: "/ferramentas/agenda", title: "Agenda", desc: "Calendário com eventos coloridos.", icon: Calendar },
];

function FerramentasLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isIndex = pathname === "/ferramentas" || pathname === "/ferramentas/";

  if (!isIndex) return <Outlet />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ferramentas</h1>
        <p className="text-muted-foreground">Recursos para impulsionar sua startup.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.url} to={t.url}>
            <Card className="p-5 hover:border-primary transition-colors h-full">
              <t.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
