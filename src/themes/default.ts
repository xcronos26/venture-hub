export interface TenantTheme {
  primaryColor: string;
  primaryForeground: string;
  secondaryColor: string;
  accentColor: string;
  background: string;
  foreground: string;
  radius: string;
}

export interface Tenant {
  id: string;
  companyName: string;
  logo: string | null;
  favicon: string | null;
  fontFamily: string;
  theme: TenantTheme;
}

export const defaultTenant: Tenant = {
  id: "default",
  companyName: "TokenBuild",
  logo: null,
  favicon: null,
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
