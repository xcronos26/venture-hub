import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TenantProvider } from "@/providers/TenantProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Página não encontrada.</p>
        <a href="/" className="mt-4 inline-block text-sm underline">Voltar ao início</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TokenBuild — Plataforma para Empreendedores" },
      { name: "description", content: "SaaS multi-tenant para empreendedores e startups." },
      { property: "og:title", content: "TokenBuild — Plataforma para Empreendedores" },
      { name: "twitter:title", content: "TokenBuild — Plataforma para Empreendedores" },
      { property: "og:description", content: "SaaS multi-tenant para empreendedores e startups." },
      { name: "twitter:description", content: "SaaS multi-tenant para empreendedores e startups." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e0c166e-a775-4302-abcf-3152d30c3543/id-preview-d7bf9888--b9871f05-efce-41da-a8f4-5f38eb943d79.lovable.app-1778678017018.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e0c166e-a775-4302-abcf-3152d30c3543/id-preview-d7bf9888--b9871f05-efce-41da-a8f4-5f38eb943d79.lovable.app-1778678017018.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <AuthProvider>
          <Outlet />
          <Toaster />
        </AuthProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}
