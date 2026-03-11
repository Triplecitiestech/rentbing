import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/Card";
import { MaintenanceForm } from "@/components/forms/MaintenanceForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Maintenance Request",
  description:
    "Submit a maintenance request for your RentBing rental property. We respond to all requests promptly.",
  openGraph: {
    title: "Maintenance Request | RentBing",
    description:
      "Submit a maintenance request for your RentBing rental property.",
  },
};

export default function MaintenancePage() {
  return (
    <>
      <PageHero
        title="Maintenance Request"
        subtitle="Submit a maintenance request and our team will address it as quickly as possible."
      />

      <Section background="gradient">
        <div className="mx-auto max-w-2xl">
          <Card variant="glass" padding="lg">
            <h2 className="mb-6 text-2xl font-bold">Report an Issue</h2>
            <MaintenanceForm />
          </Card>

          <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <h3 className="font-semibold text-red-400">Emergency?</h3>
            <p className="mt-1 text-sm text-secondary-300">
              For emergencies (gas leak, flooding, fire, no heat in winter),
              please call us immediately at{" "}
              <a href={`tel:${siteConfig.phone}`} className="font-bold text-white">
                {siteConfig.phone}
              </a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
