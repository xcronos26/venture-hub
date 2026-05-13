// Mocks de desenvolvimento — usados como fallback quando a API real falha.

export const mockUser = {
  id: "u-1",
  nome: "Empreendedor Demo",
  email: "demo@tokenbuild.com.br",
  avatarUrl: null as string | null,
  onboardingCompleto: false,
};

export const mockTenant = {
  id: "default",
  companyName: "TokenBuild",
  logo: null as string | null,
  favicon: null as string | null,
  fontFamily: "Inter, system-ui, sans-serif",
  theme: {
    primaryColor: "oklch(0.55 0.22 265)",
    primaryForeground: "oklch(0.985 0 0)",
    secondaryColor: "oklch(0.96 0.01 265)",
    accentColor: "oklch(0.7 0.18 200)",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    radius: "0.75rem",
  },
};

export const mockCnpj = (cnpj: string) => ({
  cnpj,
  razaoSocial: "Empresa Exemplo LTDA",
  nomeFantasia: "Exemplo",
  cnae: "62.01-5-01 — Desenvolvimento de programas de computador sob encomenda",
  endereco: {
    logradouro: "Av. Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01310-100",
  },
  abertura: "2020-03-12",
});

export const mockKanban = {
  columns: [
    { id: "col-1", title: "A fazer", order: 0 },
    { id: "col-2", title: "Em andamento", order: 1 },
    { id: "col-3", title: "Revisão", order: 2 },
    { id: "col-4", title: "Concluído", order: 3 },
  ],
  cards: [
    { id: "c-1", columnId: "col-1", titulo: "Validar persona ICP", descricao: "Entrevistar 5 leads.", responsavel: "Ana", prazo: "2026-05-20", prioridade: "alta" as const, etiquetas: [{ nome: "Discovery", cor: "#7c3aed" }] },
    { id: "c-2", columnId: "col-2", titulo: "MVP onboarding", descricao: "Fluxo conversacional completo.", responsavel: "Carlos", prazo: "2026-05-25", prioridade: "media" as const, etiquetas: [{ nome: "Produto", cor: "#0ea5e9" }] },
    { id: "c-3", columnId: "col-3", titulo: "Pitch para investidor anjo", descricao: "Revisão do deck.", responsavel: "Ana", prazo: "2026-05-18", prioridade: "alta" as const, etiquetas: [{ nome: "Captação", cor: "#f59e0b" }] },
    { id: "c-4", columnId: "col-4", titulo: "Contrato societário", descricao: "Assinado.", responsavel: "Jurídico", prazo: "2026-05-10", prioridade: "baixa" as const, etiquetas: [{ nome: "Legal", cor: "#10b981" }] },
  ],
};

export const mockEvents = [
  { id: "e-1", titulo: "Mentoria com Rafael Souza", data: "2026-05-15", hora: "10:00", tipo: "mentoria" as const },
  { id: "e-2", titulo: "Reunião com investidor anjo", data: "2026-05-18", hora: "14:30", tipo: "reuniao" as const },
  { id: "e-3", titulo: "Prazo: enviar deck", data: "2026-05-22", hora: "18:00", tipo: "prazo" as const },
];
