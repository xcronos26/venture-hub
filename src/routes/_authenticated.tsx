import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { OnboardingFloatingChat } from "@/components/OnboardingFloatingChat";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!authService.isAuthenticated()) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <TopNavbar />
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </SidebarInset>
        <OnboardingFloatingChat />
      </div>
    </SidebarProvider>
  );
}
