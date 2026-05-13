import { createFileRoute, redirect } from "@tanstack/react-router";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (authService.isAuthenticated()) throw redirect({ to: "/dashboard" });
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
