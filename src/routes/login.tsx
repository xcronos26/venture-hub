import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { useTenant } from "@/providers/TenantProvider";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const { tenant } = useTenant();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bem-vindo!");
      const target = redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/login")
        ? redirect
        : "/dashboard";
      navigate({ to: target as never, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-accent p-12 text-primary-foreground">
        <div className="font-semibold text-lg">{tenant.companyName}</div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Construa sua startup com confiança.</h1>
          <p className="mt-3 text-primary-foreground/80 max-w-md">
            Captação, mentorias, ferramentas e tudo que sua jornada precisa em um só lugar.
          </p>
        </div>
        <div className="text-xs opacity-70">© {new Date().getFullYear()} {tenant.companyName}</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link to="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                    Esqueci minha senha
                  </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Link to="/signup" className="text-primary hover:underline">Cadastre-se</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
