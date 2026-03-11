import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Stats {
  totalProperties: number;
  availableProperties: number;
  totalInquiries: number;
  totalMaintenance: number;
  openMaintenance: number;
  emergencyMaintenance: number;
  recentInquiries: { id: string; created_at: string }[];
  recentMaintenance: { id: string; status: string; priority: string; created_at: string }[];
  error?: string;
}

async function getStats(): Promise<Stats> {
  const empty: Stats = {
    totalProperties: 0,
    availableProperties: 0,
    totalInquiries: 0,
    totalMaintenance: 0,
    openMaintenance: 0,
    emergencyMaintenance: 0,
    recentInquiries: [],
    recentMaintenance: [],
  };

  try {
    const supabase = createAdminClient();

    const [properties, inquiries, maintenance] = await Promise.all([
      supabase.from("properties").select("id, status"),
      supabase
        .from("inquiries")
        .select("id, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("maintenance_requests")
        .select("id, status, priority, created_at")
        .order("created_at", { ascending: false }),
    ]);

    return {
      totalProperties: properties.data?.length ?? 0,
      availableProperties:
        properties.data?.filter((p) => p.status === "available").length ?? 0,
      totalInquiries: inquiries.data?.length ?? 0,
      totalMaintenance: maintenance.data?.length ?? 0,
      openMaintenance:
        maintenance.data?.filter((m) =>
          ["new", "triaged", "in_progress", "waiting_parts", "scheduled"].includes(m.status)
        ).length ?? 0,
      emergencyMaintenance:
        maintenance.data?.filter(
          (m) => m.priority === "emergency" && m.status !== "completed" && m.status !== "cancelled"
        ).length ?? 0,
      recentInquiries: (inquiries.data ?? []).slice(0, 5),
      recentMaintenance: (maintenance.data ?? []).slice(0, 5),
    };
  } catch (err) {
    return {
      ...empty,
      error: err instanceof Error ? err.message : "Failed to connect to database",
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Properties",
      value: stats.totalProperties,
      sub: `${stats.availableProperties} available`,
      href: "/admin/properties",
      color: "text-primary-400",
    },
    {
      label: "Inquiries",
      value: stats.totalInquiries,
      sub: "total received",
      href: "/admin/inquiries",
      color: "text-blue-400",
    },
    {
      label: "Maintenance",
      value: stats.openMaintenance,
      sub: `of ${stats.totalMaintenance} open`,
      href: "/admin/maintenance",
      color: "text-amber-400",
    },
    {
      label: "Emergencies",
      value: stats.emergencyMaintenance,
      sub: "active",
      href: "/admin/maintenance",
      color: stats.emergencyMaintenance > 0 ? "text-red-400" : "text-emerald-400",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {stats.error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          <strong>Database error:</strong> {stats.error}
          <p className="mt-1 text-xs text-red-400/70">
            Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your Vercel environment variables.
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover padding="md">
              <p className="text-sm text-secondary-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-secondary-500">{stat.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent inquiries */}
        <Card padding="md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              View all
            </Link>
          </div>
          {stats.recentInquiries.length === 0 ? (
            <p className="text-sm text-secondary-500">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentInquiries.map(
                (inq: { id: string; created_at: string }) => (
                  <div
                    key={inq.id}
                    className="flex items-center justify-between rounded-lg bg-secondary-800/50 px-3 py-2 text-sm"
                  >
                    <span className="text-secondary-300">
                      Inquiry {inq.id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-secondary-500">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </Card>

        {/* Recent maintenance */}
        <Card padding="md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Maintenance</h2>
            <Link
              href="/admin/maintenance"
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              View all
            </Link>
          </div>
          {stats.recentMaintenance.length === 0 ? (
            <p className="text-sm text-secondary-500">
              No maintenance requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentMaintenance.map(
                (req: {
                  id: string;
                  status: string;
                  priority: string;
                  created_at: string;
                }) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-lg bg-secondary-800/50 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          req.priority === "emergency"
                            ? "bg-red-500"
                            : req.priority === "high"
                              ? "bg-amber-500"
                              : "bg-secondary-500"
                        }`}
                      />
                      <span className="text-secondary-300">
                        {req.id.slice(0, 8)}...
                      </span>
                      <span className="rounded-full bg-secondary-700 px-2 py-0.5 text-xs text-secondary-400">
                        {req.status}
                      </span>
                    </div>
                    <span className="text-xs text-secondary-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
