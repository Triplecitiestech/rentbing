import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/Card";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = {
  title: "Rental Application",
  description:
    "Apply for a rental property with Rent Bing. Complete our online application to get started.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        title="Rental Application"
        subtitle="Complete the form below to apply for one of our rental properties. The process takes about 10 minutes."
        badge="Apply Now"
      />

      <Section background="gradient">
        <Card variant="glass" padding="lg" className="mx-auto max-w-3xl">
          <ApplicationForm />
        </Card>
      </Section>
    </>
  );
}
