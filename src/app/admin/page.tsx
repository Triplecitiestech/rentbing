import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const dashboardLinks = [
  {
    title: "Contact Submissions",
    description: "View and manage contact form submissions",
    href: "/admin/leads",
    count: null,
  },
  {
    title: "Rental Applications",
    description: "Review and process rental applications",
    href: "/admin/applications",
    count: null,
  },
  {
    title: "Maintenance Requests",
    description: "Track and manage maintenance requests",
    href: "/admin/maintenance",
    count: null,
  },
  {
    title: "System Health",
    description: "Check system status and service health",
    href: "/api/admin/system-health",
    count: null,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-secondary-400">
        Manage submissions, applications, and maintenance requests.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card variant="glass" hover className="h-full">
              <h3 className="font-semibold">{link.title}</h3>
              <p className="mt-1 text-sm text-secondary-400">
                {link.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
