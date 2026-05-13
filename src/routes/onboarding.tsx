import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { authService } from "@/services/auth.service";
import { onboardingService, type OnboardingData } from "@/services/onboarding.service";
import { useAuth } from "@/providers/AuthProvider";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!authService.isAuthenticated()) throw redirect({ to: "/login" });
  },
  component: OnboardingPage,
});

type Msg = { from: "bot" | "user"; text: string };

const STEPS = [
  "boas-vindas",
  "cnpj",
  "confirmar-empresa",
  "cpf",
  "descricao",
  "ramo",
  "diferencial",
  "publico",
  "fim",
] as const;
type Step = (typeof STEPS)[number];

function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>({});
  const [step, setStep] = useState<Step>("boas-vindas");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // carregar progresso
  useEffect(() => {
    onboardingService.load().then((d) => {
      if (d?.completo) {
        navigate({ to: "/dashboard" });
        return;
      }
      setData(d ?? {});
      const s = (STEPS[d?.step ?? 0] ?? "boas-vindas") as Step;
      setStep(s);
      pushBot(greet(s, user?.nome ?? "empreendedor", d ?? {}));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pushBot = (text: string) => setMessages((m) => [...m, { from: "bot", text }]);
  const pushUser = (text: string) => setMessages((m) => [...m, { from: "user", text }]);

  const persist = async (next: OnboardingData, nextStep: Step) => {
    const stepIndex = STEPS.indexOf(nextStep);
    const merged = { ...next, step: stepIndex };
    setData(merged);
    setStep(nextStep);
    await onboardingService.save(merged);
  };

  const handleSubmit = async () => {
    const value = input.trim();
    if (!value && step !== "boas-vindas" && step !== "publico") return;
    setBusy(true);
    try {
      switch (step) {
        case "boas-vindas":
          pushBot("Para começar, qual é o CNPJ da sua empresa?");
          await persist(data, "cnpj");
          break;
        case "cnpj": {
          if (!onboardingService.validateCnpj(value)) {
            pushBot("Hmm, esse CNPJ parece inválido. Pode tentar novamente?");
            break;
          }
          pushUser(value);
          pushBot("Consultando seus dados...");
          const empresa = await onboardingService.consultarCnpj(value);
          pushBot(`Encontrei: ${empresa.razaoSocial} (${empresa.cnae}). Está correto? Digite "sim" para confirmar.`);
          await persist({ ...data, cnpj: value, empresa }, "confirmar-empresa");
          break;
        }
        case "confirmar-empresa":
          pushUser(value);
          if (!/^s/i.test(value)) {
            pushBot("Sem problemas. Qual é o CNPJ correto?");
            await persist(data, "cnpj");
            break;
          }
          pushBot("Ótimo! Agora preciso do CPF do responsável legal.");
          await persist(data, "cpf");
          break;
        case "cpf":
          if (!onboardingService.validateCpf(value)) {
            pushBot("Esse CPF não parece válido. Pode conferir?");
            break;
          }
          pushUser(value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.***.$3-$4"));
          pushBot("Perfeito. Em poucas palavras, descreva o que sua empresa faz.");
          await persist({ ...data, cpfResponsavel: value }, "descricao");
          break;
        case "descricao":
          pushUser(value);
          pushBot("E qual é o ramo de atuação?");
          await persist({ ...data, descricao: value }, "ramo");
          break;
        case "ramo":
          pushUser(value);
          pushBot("Qual é o diferencial competitivo da sua empresa?");
          await persist({ ...data, ramo: value }, "diferencial");
          break;
        case "diferencial":
          pushUser(value);
          pushBot("Por último: seu público é B2B, B2C ou B2G?");
          await persist({ ...data, diferencial: value }, "publico");
          break;
        case "publico": {
          const v = value.toUpperCase();
          if (!["B2B", "B2C", "B2G"].includes(v)) {
            pushBot("Responda apenas B2B, B2C ou B2G.");
            break;
          }
          pushUser(v);
          pushBot("Pronto! Estou finalizando seu cadastro...");
          await persist({ ...data, publico: v as "B2B" | "B2C" | "B2G" }, "fim");
          await onboardingService.complete();
          toast.success("Onboarding concluído!");
          setTimeout(() => navigate({ to: "/dashboard" }), 800);
          break;
        }
        case "fim":
          break;
      }
      setInput("");
    } catch {
      toast.error("Erro ao salvar etapa");
    } finally {
      setBusy(false);
    }
  };

  const progress = (STEPS.indexOf(step) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="border-b bg-background px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">Configuração inicial</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  m.from === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-background p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          className="max-w-2xl mx-auto flex gap-2"
        >
          <Input
            placeholder={placeholderFor(step)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy || step === "fim"}
            autoFocus
          />
          <Button type="submit" disabled={busy || step === "fim"}>
            {step === "boas-vindas" ? "Começar" : "Enviar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function greet(step: Step, nome: string, d: OnboardingData) {
  const first = `Olá ${nome.split(" ")[0]}, vamos configurar sua empresa juntos. 🚀`;
  if (step === "boas-vindas") return first;
  return `Bem-vindo de volta! Vamos continuar de onde paramos.${d.empresa ? ` (${d.empresa.razaoSocial})` : ""}`;
}

function placeholderFor(step: Step): string {
  switch (step) {
    case "boas-vindas":
      return "Clique em começar";
    case "cnpj":
      return "00.000.000/0000-00";
    case "confirmar-empresa":
      return "sim / não";
    case "cpf":
      return "000.000.000-00";
    case "publico":
      return "B2B, B2C ou B2G";
    case "fim":
      return "Concluído";
    default:
      return "Digite sua resposta...";
  }
}
