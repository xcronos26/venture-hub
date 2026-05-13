import { createFileRoute, redirect } from "@tanstack/react-router";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Server: sempre manda para /login (sem acesso a localStorage).
    // Client: se já autenticado, vai para /dashboard.
    if (typeof window !== "undefined" && authService.isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
