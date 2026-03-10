export const mainNavigation = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const portalNavigation = [
  { label: "Dashboard", href: "/portal" },
  { label: "Payments", href: "/portal/payments" },
  { label: "Maintenance", href: "/portal/maintenance" },
  { label: "Documents", href: "/portal/documents" },
] as const;

export const adminNavigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Maintenance", href: "/admin/maintenance" },
] as const;
