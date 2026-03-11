import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-950 p-4">
        <div className="rounded-xl border border-red-500/30 bg-red-600/10 p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-red-400">
            ADMIN_API_KEY not configured
          </h1>
          <p className="text-sm text-secondary-400">
            Add ADMIN_API_KEY to your environment variables to use the admin
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Verify the key hasn't been tampered with via query params
  void redirect;

  return <AdminShell adminKey={adminKey}>{children}</AdminShell>;
}
