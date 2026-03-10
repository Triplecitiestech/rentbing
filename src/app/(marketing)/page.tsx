import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/shared/Section";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { ServiceCard } from "@/components/shared/ServiceCard";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-secondary-900 to-secondary-950 py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-cyan/5 blur-3xl" />
      </div>
      <Container className="relative z-10 text-center">
        <span className="mb-6 inline-block rounded-full bg-primary-600/20 px-4 py-1.5 text-sm font-medium text-primary-400 border border-primary-500/30">
          Professional Property Management
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Find Your Perfect
          <br />
          <span className="bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">
            Rental Home
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary-400 sm:text-xl">
          Quality properties, responsive management, and a seamless rental
          experience. Let us help you find your next home.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/properties">
            <Button size="lg">Browse Properties</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      title: "Quality Properties",
      description:
        "Carefully maintained homes and apartments in desirable locations, ready for you to move in.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A1.125 1.125 0 015.25 11V5.25A2.25 2.25 0 017.5 3h9a2.25 2.25 0 012.25 2.25v5.75a1.125 1.125 0 01-.786 1.08l-5.384 3.19a1.125 1.125 0 01-1.16 0z" />
        </svg>
      ),
      title: "Responsive Management",
      description:
        "24/7 maintenance support and a dedicated team that responds quickly to your needs.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Easy Applications",
      description:
        "Simple online application process with quick turnaround. Apply from anywhere, anytime.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      title: "Transparent Pricing",
      description:
        "No hidden fees. Clear lease terms and upfront pricing so you know exactly what to expect.",
    },
  ];

  return (
    <Section background="gradient" id="features">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Why Choose Rent Bing?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-secondary-400">
          We make renting simple, transparent, and hassle-free.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </Section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "For Renters",
      description: "Find your perfect home with confidence.",
      features: [
        "Browse available properties online",
        "Easy online application",
        "24/7 maintenance portal",
        "Secure online payments",
        "Dedicated tenant support",
      ],
      ctaText: "View Properties",
      ctaHref: "/properties",
    },
    {
      title: "For Property Owners",
      description: "Maximize your investment with professional management.",
      features: [
        "Tenant screening & placement",
        "Rent collection & accounting",
        "Property maintenance coordination",
        "Regular property inspections",
        "Financial reporting & analytics",
      ],
      ctaText: "Learn More",
      ctaHref: "/about",
    },
  ];

  return (
    <Section background="darker" id="services">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Our Services</h2>
        <p className="mx-auto mt-4 max-w-2xl text-secondary-400">
          Whether you&apos;re looking for a rental or need property management,
          we&apos;ve got you covered.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </Section>
  );
}

function CTASection() {
  return (
    <Section background="primary">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to Find Your Next Home?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-secondary-300">
          Browse our available properties or get in touch with our team today.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/properties">
            <Button size="lg">Browse Properties</Button>
          </Link>
          <Link href="/apply">
            <Button variant="outline" size="lg">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <CTASection />
    </>
  );
}
