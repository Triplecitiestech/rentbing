import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

const statusVariant = {
  draft: "default",
  submitted: "primary",
  reviewing: "warning",
  approved: "success",
  denied: "danger",
} as const;

export default async function ApplicationsPage() {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from("rental_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold">Rental Applications</h1>
      <p className="mt-2 text-secondary-400">
        Review and manage rental applications.
      </p>

      <div className="mt-8">
        {error ? (
          <p className="text-sm text-red-400">Failed to load: {error.message}</p>
        ) : applications?.length === 0 ? (
          <Card variant="glass">
            <p className="text-secondary-400">No applications yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications?.map((app) => (
              <Card key={app.id} variant="glass" padding="sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {app.first_name} {app.last_name}
                      </span>
                      <Badge
                        variant={
                          statusVariant[
                            app.status as keyof typeof statusVariant
                          ] || "default"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-400">
                      {app.email} | {app.phone}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                      {app.desired_property && (
                        <div>
                          <span className="text-secondary-500">Property: </span>
                          <span className="text-secondary-300">{app.desired_property}</span>
                        </div>
                      )}
                      {app.desired_move_in && (
                        <div>
                          <span className="text-secondary-500">Move-in: </span>
                          <span className="text-secondary-300">
                            {new Date(app.desired_move_in).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {app.monthly_income && (
                        <div>
                          <span className="text-secondary-500">Income: </span>
                          <span className="text-secondary-300">
                            ${Number(app.monthly_income).toLocaleString()}/mo
                          </span>
                        </div>
                      )}
                      {app.num_occupants && (
                        <div>
                          <span className="text-secondary-500">Occupants: </span>
                          <span className="text-secondary-300">{app.num_occupants}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-secondary-500">
                    {new Date(app.created_at).toLocaleDateString()}
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
