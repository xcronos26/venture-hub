import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TrendingUp, GraduationCap, Wrench, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { onboardingService } from "@/services/onboarding.service";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    setNeedsOnboarding(!onboardingService.isComplete());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Olá, {user?.nome?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground">Aqui está o resumo da sua jornada hoje.</p>
      </div>

      {needsOnboarding && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle>Termine seu cadastro</CardTitle>
            <CardDescription>Complete o onboarding para liberar todos os recursos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/onboarding">Continuar onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Captação", value: "R$ 0", icon: TrendingUp },
          { label: "Mentorias", value: "2", icon: GraduationCap },
          { label: "Tarefas abertas", value: "4", icon: Wrench },
          { label: "Próximos eventos", value: "3", icon: CalendarIcon },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{s.label}</CardDescription>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atalhos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild><Link to="/ferramentas/kanban">Kanban</Link></Button>
            <Button variant="outline" asChild><Link to="/ferramentas/agenda">Agenda</Link></Button>
            <Button variant="outline" asChild><Link to="/ferramentas/calculadora">Calculadora</Link></Button>
            <Button variant="outline" asChild><Link to="/ferramentas/pitch-deck">Pitch Deck</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximos passos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Configure o perfil da sua empresa</p>
            <p>• Cadastre sua primeira rodada de captação</p>
            <p>• Agende sua primeira mentoria</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
