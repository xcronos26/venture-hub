import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  GraduationCap,
  BookOpen,
  FileText,
  Wrench,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTenant } from "@/providers/TenantProvider";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Perfil da Empresa", url: "/empresa", icon: Building2 },
  { title: "Captação", url: "/captacao", icon: TrendingUp },
  { title: "Mentorias", url: "/mentorias", icon: GraduationCap },
  { title: "Aprendizado", url: "/aprendizado", icon: BookOpen },
  { title: "Documentos", url: "/documentos", icon: FileText },
  { title: "Ferramentas", url: "/ferramentas", icon: Wrench },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { tenant } = useTenant();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shrink-0">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.companyName} className="h-8 w-8 rounded-md object-contain" />
            ) : (
              tenant.companyName.charAt(0)
            )}
          </div>
          {!collapsed && <span className="font-semibold truncate">{tenant.companyName}</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
