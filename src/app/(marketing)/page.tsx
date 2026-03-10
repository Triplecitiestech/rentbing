import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-secondary-900 to-secondary-950 py-20 sm:py-28 lg:py-36">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-cyan/5 blur-3xl" />
      </div>
      <Container className="relative z-10">
        <div className="text-center">
          <p className="mb-4 text-lg text-secondary-300">
            RentBing is a premier provider of off-campus student housing for
            Binghamton University Students and Graduate Students
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Apartments For Rent
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">
              2026-2027
            </span>
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/properties">
              <Button size="lg">View Properties</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
            <a href={`tel:${siteConfig.phone}`}>
              <Button variant="ghost" size="lg">
                {siteConfig.phone}
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeaturedListings() {
  const listings = [
    {
      title: "Two Bedroom",
      price: "From $699.95 per Bedroom",
      description: "Spacious two-bedroom apartments in Downtown Binghamton",
    },
    {
      title: "Live Downtown Binghamton",
      price: "Prime Location",
      description: "Walk to campus, restaurants, and entertainment",
    },
    {
      title: "Studios",
      price: "From $899.95",
      description: "Cozy studio apartments perfect for graduate students",
    },
  ];

  return (
    <Section background="gradient">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Available Apartments
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-secondary-400">
          Quality off-campus housing near Binghamton University
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.title} variant="glass" hover>
            <div className="mb-4 h-48 rounded-lg bg-gradient-to-br from-secondary-700 to-secondary-800 flex items-center justify-center">
              <svg className="h-16 w-16 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">{listing.title}</h3>
            <p className="mt-1 text-lg font-semibold text-primary-400">
              {listing.price}
            </p>
            <p className="mt-2 text-sm text-secondary-400">
              {listing.description}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/properties">
          <Button size="lg">See All Properties</Button>
        </Link>
      </div>
    </Section>
  );
}

function ContactSection() {
  return (
    <Section background="darker" id="contact">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-secondary-400">
            Interested in renting? Fill out the form and we&apos;ll get back to
            you as soon as possible.
          </p>
          <div className="mt-6 space-y-3 text-secondary-300">
            <p>
              <strong className="text-white">Phone:</strong>{" "}
              <a href={`tel:${siteConfig.phone}`} className="hover:text-primary-400">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <strong className="text-white">Email:</strong>{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-primary-400">
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>
        </div>
        <Card variant="glass" padding="lg">
          <h3 className="mb-6 text-xl font-bold">Contact Us</h3>
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <ContactSection />
    </>
  );
}
