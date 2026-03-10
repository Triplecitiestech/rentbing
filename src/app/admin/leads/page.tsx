import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Leads & Contacts" };
export const dynamic = "force-dynamic";

const statusVariant = {
  new: "primary",
  contacted: "warning",
  resolved: "success",
  qualified: "success",
  converted: "success",
} as const;

export default async function LeadsPage() {
  const supabase = await createClient();

  const [contacts, inquiries] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("rental_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Leads & Contact Submissions</h1>

      {/* Contact submissions */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-secondary-300">
          Contact Form Submissions
        </h2>
        {contacts.error ? (
          <p className="text-sm text-red-400">
            Failed to load: {contacts.error.message}
          </p>
        ) : contacts.data?.length === 0 ? (
          <Card variant="glass">
            <p className="text-secondary-400">No contact submissions yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {contacts.data?.map((sub) => (
              <Card key={sub.id} variant="glass" padding="sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sub.name}</span>
                      <Badge
                        variant={
                          statusVariant[
                            sub.status as keyof typeof statusVariant
                          ] || "default"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-400">
                      {sub.email}
                      {sub.phone && ` | ${sub.phone}`}
                    </p>
                    <p className="mt-1 text-sm text-secondary-300 line-clamp-2">
                      {sub.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-secondary-500">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Rental inquiries */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-secondary-300">
          Rental Inquiries
        </h2>
        {inquiries.error ? (
          <p className="text-sm text-red-400">
            Failed to load: {inquiries.error.message}
          </p>
        ) : inquiries.data?.length === 0 ? (
          <Card variant="glass">
            <p className="text-secondary-400">No rental inquiries yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {inquiries.data?.map((inq) => (
              <Card key={inq.id} variant="glass" padding="sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{inq.name}</span>
                      <Badge
                        variant={
                          statusVariant[
                            inq.status as keyof typeof statusVariant
                          ] || "default"
                        }
                      >
                        {inq.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-400">
                      {inq.email}
                      {inq.property_name && ` | Property: ${inq.property_name}`}
                    </p>
                    <p className="mt-1 text-sm text-secondary-300 line-clamp-2">
                      {inq.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-secondary-500">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
