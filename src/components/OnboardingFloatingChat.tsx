import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingService } from "@/services/onboarding.service";

export function OnboardingFloatingChat() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const incompleto = !onboardingService.isComplete();

  if (pathname.startsWith("/onboarding")) return null;
  if (!incompleto) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 w-72 rounded-lg border bg-card p-4 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">Vamos terminar seu cadastro?</p>
            <button onClick={() => setOpen(false)} aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Faltam algumas informações para liberar todos os recursos.
          </p>
          <Button asChild size="sm" className="mt-3 w-full">
            <Link to="/onboarding">Continuar onboarding</Link>
          </Button>
        </div>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-label="Onboarding"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
