import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Maintenance Requests" };
export const dynamic = "force-dynamic";

const statusVariant = {
  new: "primary",
  in_progress: "warning",
  completed: "success",
} as const;

const priorityVariant = {
  low: "default",
  medium: "warning",
  high: "danger",
  emergency: "danger",
} as const;

export default async function AdminMaintenancePage() {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("maintenance_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold">Maintenance Requests</h1>
      <p className="mt-2 text-secondary-400">
        Track and manage maintenance requests from tenants.
      </p>

      <div className="mt-8">
        {error ? (
          <p className="text-sm text-red-400">Failed to load: {error.message}</p>
        ) : requests?.length === 0 ? (
          <Card variant="glass">
            <p className="text-secondary-400">No maintenance requests yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests?.map((req) => (
              <Card key={req.id} variant="glass" padding="sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{req.property_address}</span>
                      {req.unit_number && (
                        <span className="text-sm text-secondary-400">
                          Unit {req.unit_number}
                        </span>
                      )}
                      <Badge
                        variant={
                          statusVariant[
                            req.status as keyof typeof statusVariant
                          ] || "default"
                        }
                      >
                        {req.status}
                      </Badge>
                      <Badge
                        variant={
                          priorityVariant[
                            req.priority as keyof typeof priorityVariant
                          ] || "default"
                        }
                      >
                        {req.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-400">
                      {req.name} | {req.email} | Category: {req.category}
                    </p>
                    <p className="mt-1 text-sm text-secondary-300 line-clamp-2">
                      {req.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-secondary-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
