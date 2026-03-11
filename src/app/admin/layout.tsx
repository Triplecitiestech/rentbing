import AdminShell from "@/components/admin/AdminShell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const adminKey = process.env.ADMIN_API_KEY ?? "";

  return <AdminShell adminKey={adminKey}>{children}</AdminShell>;
}
