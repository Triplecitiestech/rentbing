import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Properties", href: "/properties" },
  ],
  tenants: [
    { label: "Apply Now", href: "/apply" },
    { label: "Maintenance Request", href: "/maintenance" },
    { label: "Tenant Portal", href: "/portal" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Fair Housing", href: "/fair-housing" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-secondary-800 bg-secondary-950">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-primary-400">Rent</span>
              <span className="text-white">Bing</span>
            </Link>
            <p className="mt-3 text-sm text-secondary-400">
              Professional property management services. Find your next rental
              home or let us manage your investment property.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-300">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tenants */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-300">
              Tenants
            </h3>
            <ul className="space-y-2">
              {footerLinks.tenants.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-300">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-800 pt-8 text-center text-sm text-secondary-500">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
