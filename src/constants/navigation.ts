import { siteConfig } from "@/config/site";

export const mainNavigation = [
  { label: "Properties", href: "/properties" },
  { label: "Maintenance", href: "/maintenance" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const headerActions = [
  {
    label: "Application",
    href: siteConfig.externalLinks.application,
    external: true,
  },
  { label: "Contact", href: "/contact", external: false },
  {
    label: "Tenant",
    href: siteConfig.externalLinks.tenantLogin,
    external: true,
  },
] as const;
