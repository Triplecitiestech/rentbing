import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { FeatureCard } from "@/components/shared/FeatureCard";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Rent Bing — professional property management services dedicated to quality housing and excellent tenant experiences.",
};

const values = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Integrity",
    description:
      "We operate with transparency and honesty in every interaction with tenants and property owners.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Responsiveness",
    description:
      "Quick response times for maintenance requests, inquiries, and concerns — because your time matters.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Quality Housing",
    description:
      "We maintain high standards for every property we manage, ensuring safe and comfortable homes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Rent Bing"
        subtitle="Professional property management built on trust, transparency, and exceptional service."
        badge="Our Story"
      />

      <Section background="gradient">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-relaxed text-secondary-300">
            Rent Bing was founded with a simple mission: to provide quality
            rental housing with property management that actually works. We
            believe every tenant deserves responsive service, well-maintained
            properties, and clear communication.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-secondary-300">
            For property owners, we offer peace of mind through professional
            management, transparent reporting, and a technology-driven approach
            that maximizes your investment.
          </p>
        </div>
      </Section>

      <Section background="darker" id="values">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Our Values</h2>
          <p className="mx-auto mt-4 max-w-2xl text-secondary-400">
            The principles that guide everything we do.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value) => (
            <FeatureCard key={value.title} {...value} />
          ))}
        </div>
      </Section>

      <Section background="gradient">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">
            Service Area
          </h2>
          <div className="rounded-xl border border-secondary-700/50 bg-secondary-800/50 p-8 text-center">
            <p className="text-lg text-secondary-300">
              We proudly serve the Tri-Cities area and surrounding communities.
              Contact us to learn more about our service coverage.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
