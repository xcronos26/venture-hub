import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultTenant, type Tenant, type TenantTheme } from "@/themes/default";

interface TenantContextValue {
  tenant: Tenant;
  setTenant: (t: Tenant) => void;
  updateTheme: (patch: Partial<TenantTheme>) => void;
}

const TenantContext = createContext<TenantContextValue | null>(null);
const LS = "tb:tenant-config";

function applyToDom(t: Tenant) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  r.style.setProperty("--primary", t.theme.primaryColor);
  r.style.setProperty("--primary-foreground", t.theme.primaryForeground);
  r.style.setProperty("--secondary", t.theme.secondaryColor);
  r.style.setProperty("--accent", t.theme.accentColor);
  r.style.setProperty("--ring", t.theme.primaryColor);
  r.style.setProperty("--sidebar-primary", t.theme.primaryColor);
  r.style.setProperty("--sidebar-primary-foreground", t.theme.primaryForeground);
  r.style.setProperty("--radius", t.theme.radius);
  document.body.style.fontFamily = t.fontFamily;
  if (t.favicon) {
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = t.favicon;
  }
  document.title = t.companyName;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantState] = useState<Tenant>(() => {
    if (typeof window === "undefined") return defaultTenant;
    const raw = localStorage.getItem(LS);
    return raw ? { ...defaultTenant, ...JSON.parse(raw) } : defaultTenant;
  });

  useEffect(() => {
    applyToDom(tenant);
    if (typeof window !== "undefined") localStorage.setItem(LS, JSON.stringify(tenant));
  }, [tenant]);

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant,
      setTenant: (t) => setTenantState(t),
      updateTheme: (patch) =>
        setTenantState((prev) => ({ ...prev, theme: { ...prev.theme, ...patch } })),
    }),
    [tenant],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used inside TenantProvider");
  return ctx;
}
