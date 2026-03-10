"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { mainNavigation } from "@/constants/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-secondary-800 bg-secondary-950/80 backdrop-blur-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-primary-400">Rent</span>
            <span className="text-white">Bing</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary-300 transition-colors hover:text-white hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/apply" className="ml-2">
              <Button size="sm">Apply Now</Button>
            </Link>
          </nav>

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

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary-300 transition-colors hover:text-white hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/apply" className="mt-2" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">
                Apply Now
              </Button>
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
