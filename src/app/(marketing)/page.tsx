import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 py-24 sm:py-32 lg:py-40">
      {/* Background visual effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary-500)_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-accent-lime)_0%,_transparent_50%)] opacity-8" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-lime" />
            Now Leasing for 2026–2027
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            Off-Campus Living
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-primary-200 to-primary-300 bg-clip-text text-transparent">
              Done Right
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Premier student housing near Binghamton University. 20+ years of
            providing quality apartments in Downtown Binghamton.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/properties">
              <Button size="lg" className="bg-white px-8 text-lg font-semibold text-primary-700 shadow-lg hover:bg-primary-100">
                View Properties
              </Button>
            </Link>
            <a
              href={siteConfig.externalLinks.application}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-white/40 px-8 text-lg text-white hover:bg-white/10">
                Apply Now
              </Button>
            </a>
            <a href={`tel:${siteConfig.phone}`}>
              <Button variant="ghost" size="lg" className="text-lg text-white/80 hover:text-white">
                Call {siteConfig.phone}
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
              Pet Friendly Options
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
              Minutes to Campus
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
              On-Site Laundry
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: "20+", label: "Years Experience" },
    { value: "6+", label: "Properties" },
    { value: "50+", label: "Happy Tenants" },
    { value: "5 min", label: "To Campus" },
  ];

  return (
    <section className="border-y border-secondary-800/50 bg-secondary-900/80 py-10">
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary-400 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-secondary-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedListings() {
  const listings = [
    {
      title: "Two Bedrooms",
      price: "From $700/bedroom",
      address: "132 & 139 Washington St",
      features: ["Downtown Location", "Near Campus", "Laundry On-Site"],
      gradient: "from-primary-600/80 via-primary-700/60 to-primary-900/80",
      accent: "bg-primary-500",
    },
    {
      title: "Studios & One Bedrooms",
      price: "From $975/month",
      address: "139 & 257 Washington St",
      features: ["Perfect for Grad Students", "Private Living", "All Utilities Options"],
      gradient: "from-primary-500/60 via-emerald-700/40 to-secondary-900/80",
      accent: "bg-primary-400",
    },
    {
      title: "Large Multi-Bedrooms",
      price: "From $600/person",
      address: "135 Washington & Court St",
      features: ["Great for Groups", "4-7+ Bedrooms", "Utilities Included Options"],
      gradient: "from-emerald-600/50 via-teal-800/40 to-secondary-900/80",
      accent: "bg-accent-emerald",
    },
  ];

  return (
    <section className="bg-secondary-950 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Find Your{" "}
            <span className="text-primary-400">
              Perfect Place
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-400">
            Quality off-campus housing in Downtown Binghamton — just minutes
            from Binghamton University.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div
              key={listing.title}
              className="group relative overflow-hidden rounded-2xl border border-secondary-700/50 bg-secondary-900 transition-all duration-300 hover:-translate-y-1 hover:border-primary-600/50 hover:shadow-2xl hover:shadow-primary-500/10"
            >
              {/* Gradient image area */}
              <div
                className={`relative h-52 bg-gradient-to-br ${listing.gradient} flex items-end p-6`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
                <div className="relative">
                  <div
                    className={`mb-2 inline-block rounded-full ${listing.accent} px-3 py-1 text-xs font-bold text-white`}
                  >
                    {listing.price}
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    {listing.title}
                  </h3>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <p className="mb-4 text-sm font-medium text-secondary-400">
                  {listing.address}
                </p>
                <ul className="space-y-2">
                  {listing.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-secondary-300"
                    >
                      <svg className="h-4 w-4 shrink-0 text-primary-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/properties">
            <Button size="lg" className="px-10 text-lg">
              See All Properties
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function WhyRentBing() {
  const reasons = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
      ),
      title: "Prime Locations",
      description:
        "All properties are within minutes of Binghamton University campus and Downtown Binghamton.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.36-3.1a1.499 1.499 0 01-.55-2.05l3.1-5.36a1.5 1.5 0 012.05-.55l5.36 3.1a1.5 1.5 0 01.55 2.05l-3.1 5.36a1.5 1.5 0 01-2.05.55z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
      ),
      title: "Responsive Maintenance",
      description:
        "Submit maintenance requests online and get fast, reliable service from our dedicated team.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
      ),
      title: "20+ Years Experience",
      description:
        "A trusted name in Binghamton student housing with decades of reliable property management.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
      ),
      title: "Affordable Pricing",
      description:
        "Competitive per-bedroom pricing with utilities-included options. From $600/person.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-secondary-950 to-[#0a0f1e] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why Students Choose{" "}
            <span className="text-primary-400">RentBing</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-700/20 text-primary-400">
                {reason.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-400">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="bg-[#0a0f1e] py-16 sm:py-20 lg:py-24" id="contact">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left column — info */}
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Find Your{" "}
              <span className="text-primary-400">New Home?</span>
            </h2>
            <p className="mt-4 text-lg text-secondary-400">
              Fill out the form and we&apos;ll get back to you within 24 hours.
              Or reach out directly — we&apos;d love to hear from you.
            </p>

            <div className="mt-8 space-y-4">
              {/* Phone card */}
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-4 rounded-xl border border-secondary-700/50 bg-secondary-900/50 p-4 transition-colors hover:border-primary-600/50 hover:bg-secondary-800/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-700/20 text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div>
                  <div className="text-sm text-secondary-400">Call us</div>
                  <div className="font-semibold text-white">
                    {siteConfig.phone}
                  </div>
                </div>
              </a>

              {/* Email card */}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="flex items-center gap-4 rounded-xl border border-secondary-700/50 bg-secondary-900/50 p-4 transition-colors hover:border-primary-600/50 hover:bg-secondary-800/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-700/20 text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div>
                  <div className="text-sm text-secondary-400">Email us</div>
                  <div className="font-semibold text-white">
                    {siteConfig.contactEmail}
                  </div>
                </div>
              </a>

              {/* Apply card */}
              <a
                href={siteConfig.externalLinks.application}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-primary-600/30 bg-primary-700/10 p-4 transition-colors hover:border-primary-600/50 hover:bg-primary-700/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-700/20 text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <div>
                  <div className="text-sm text-secondary-400">
                    Ready to apply?
                  </div>
                  <div className="font-semibold text-primary-400">
                    Submit a Rental Application
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right column — form */}
          <Card variant="glass" padding="lg">
            <h3 className="mb-6 text-xl font-bold">Send Us a Message</h3>
            <ContactForm />
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <WhyRentBing />
      <ContactSection />
    </>
  );
}
