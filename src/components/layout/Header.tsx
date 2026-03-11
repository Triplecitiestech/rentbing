"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

const navLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Contact", href: "/contact" },
  { label: "Maintenance", href: "/maintenance" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-700 shadow-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              <span className="text-white">Rent</span>
              <span className="text-primary-300">Bing</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${siteConfig.phone}`}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {siteConfig.phone}
            </a>
            <a
              href={siteConfig.externalLinks.application}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
            >
              Apply Now
            </a>
            <a
              href={siteConfig.externalLinks.tenantLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Tenant Login
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-1 border-t border-white/10 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-white/10" />
            <a
              href={`tel:${siteConfig.phone}`}
              className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Call {siteConfig.phone}
            </a>
            <a
              href={siteConfig.externalLinks.application}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-3 py-2.5 text-center text-sm font-semibold text-primary-700"
              onClick={() => setMobileOpen(false)}
            >
              Apply Now
            </a>
            <a
              href={siteConfig.externalLinks.tenantLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/30 px-3 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Tenant Login
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
