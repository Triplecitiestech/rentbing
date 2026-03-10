"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

const navActions = [
  {
    label: "Application",
    href: siteConfig.externalLinks.application,
    external: true,
  },
  { label: "Contact", href: "/contact", external: false },
  {
    label: "Tenant",
    href: siteConfig.externalLinks.tenantLogin,
    external: true,
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-secondary-800 bg-secondary-950/90 backdrop-blur-lg">
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              <span className="text-primary-400">Rent</span>
              <span className="text-white">Bing</span>
            </span>
          </Link>

          {/* Center banner — desktop */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="rounded border border-primary-700 bg-primary-950/50 px-6 py-2 text-center">
              <span className="text-sm font-semibold tracking-wide text-white">
                Apartments For Rent 2026-2027
              </span>
            </div>
            <div className="rounded border border-primary-700 bg-primary-950/50 px-6 py-2">
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-sm font-semibold text-white"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary-300 hover:text-white md:hidden"
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

        {/* Action buttons row — desktop */}
        <div className="hidden items-center justify-center gap-3 pb-3 md:flex">
          {navActions.map((action) =>
            action.external ? (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-primary-600 px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                {action.label}
              </a>
            ) : (
              <Link
                key={action.label}
                href={action.href}
                className="rounded border border-primary-600 px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                {action.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <div className="mb-3 flex flex-col gap-2 text-center text-sm">
            <span className="text-secondary-300">Apartments For Rent 2026-2027</span>
            <a href={`tel:${siteConfig.phone}`} className="font-semibold text-white">
              {siteConfig.phone}
            </a>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/properties"
              className="rounded-lg px-3 py-2 text-center text-sm font-medium text-secondary-300 hover:text-white hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
            >
              Properties
            </Link>
            {navActions.map((action) =>
              action.external ? (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-primary-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {action.label}
                </a>
              ) : (
                <Link
                  key={action.label}
                  href={action.href}
                  className="rounded border border-primary-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {action.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
