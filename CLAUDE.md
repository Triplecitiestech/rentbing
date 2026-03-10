# CLAUDE.md — AI Assistant Guide for RentBing

> **This is the single source of truth for every Claude Code session.** Read this file first. It tells you how to behave, how to ship, and how to avoid mistakes.

---

## Core Rules — Read These First

### 1. Be autonomous. Do not ask the user to fix things you can fix yourself.
If you encounter an error — a build failure, a lint warning, a type mismatch, a broken import — diagnose it and fix it. Only escalate to the user when the problem genuinely requires information you cannot obtain (credentials, business decisions, ambiguous product requirements).

### 2. Every change must be fully tested and validated before deploying.
- Run `npm run build` after every meaningful change. It must pass.
- Run `npm run lint` and fix all errors.
- Review your own `git diff` before committing.
- Check that UI changes work at mobile (`sm`/`md`) AND desktop (`lg`+) breakpoints.
- Completion means the feature works end-to-end, not just that it compiles.

### 3. Every completed task must be committed and pushed.
- Commit after each logical unit of work.
- Push immediately to the working branch with `git push -u origin <branch>`.
- Retry with exponential backoff (2s, 4s, 8s, 16s) on network failure.

### 4. When something breaks, fix it — don't report it and stop.

### 5. Keep CLAUDE.md up to date.
When the user corrects you or you learn a new project convention, update this file.

---

## Project Overview

**RentBing is a rental listing and marketing website**, NOT a property management platform. It displays available rental properties owned by the company, presents property photos, and allows visitors to submit rental inquiries. The target audience is Binghamton University students and graduate students looking for off-campus housing.

**What this site IS:**
- A marketing website for rental properties
- A rental listing directory with photos, prices, and details
- A contact/inquiry form for prospective tenants
- A link hub to external Buildium portals for applications and tenant login

**What this site is NOT:**
- A tenant portal (use Buildium for that)
- A maintenance ticketing system
- An accounting or payment system
- A property management dashboard

**Production URL**: https://www.rentbing.com
**Preview URL pattern**: https://<branch-name>-rentbing.vercel.app
**Phone**: 607-484-7654

**External Links:**
- Application: https://rentbing1.managebuilding.com/Resident/rental-application/new/apply
- Tenant Login: https://rentbing1.managebuilding.com/Resident/public/home

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router), React, TypeScript (strict) |
| **Styling** | Tailwind CSS 4 with custom theme |
| **Database** | Supabase (PostgreSQL + Storage) — direct client, no Prisma |
| **Hosting** | Vercel |
| **Email** | Resend (deferred — not yet configured) |
| **Bot Protection** | Cloudflare Turnstile (deferred — not yet configured) |

**Important**: This project does NOT use Prisma. All database access goes through the Supabase JS client (`@supabase/supabase-js` and `@supabase/ssr`).

---

## Database Schema

Three tables in Supabase:

| Table | Purpose |
|-------|---------|
| `properties` | Rental listings (address, title, price, bedrooms, bathrooms, status) |
| `property_images` | Photos for each property (image_url, sort_order) |
| `inquiries` | Contact form submissions (name, email, phone, bedroom preference, message) |

SQL migration: `supabase/migrations/001_initial_tables.sql`
Seed data: `supabase/seed.sql`

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Next.js build (MUST PASS)
npm run start        # Start production server
npm run lint         # ESLint (MUST PASS, fix all errors)
```

---

## Directory Structure

```
src/
  app/
    (marketing)/        # Public pages (home, properties, contact)
    api/                # API route handlers
  components/
    layout/             # Header, Footer
    sections/           # Hero, Features, CTA
    ui/                 # Button, Card, Container, Input, etc.
    shared/             # Section, PageHero, FeatureCard
    properties/         # ImageGallery (with lightbox)
    forms/              # ContactForm
    seo/                # JSON-LD schemas
  lib/
    supabase/           # Supabase clients (server.ts, client.ts, admin.ts)
  config/               # Site metadata, external links
  constants/            # Navigation
  types/                # TypeScript type definitions
  utils/                # cn.ts (clsx + tailwind-merge)
  middleware.ts         # Security headers, bot blocking
supabase/
  migrations/           # SQL migrations
  seed.sql              # Initial property data
```

---

## Code Conventions

**TypeScript**: Strict mode, no `any`. Interfaces for all props/params.

**React/Next.js**: Server components by default; add `'use client'` only when needed.

**Styling**: Tailwind utility classes, mobile-first. Every layout must be responsive.

**Path alias**: `@/*` maps to `./src/*`.

**Database**: Supabase JS client for all DB access. Use `createClient()` from `@/lib/supabase/server` in server components/API routes, `@/lib/supabase/client` in client components, `createAdminClient()` for service-role operations.

**Images**: Property images stored in Supabase Storage, referenced via `property_images` table. Use responsive loading, lightbox for full-size viewing.

---

## Git Workflow

- Develop on `claude/[description]-[sessionId]` branches
- Never push directly to `main`
- Auto-merge via GitHub Actions (claude/** → main)
- Commit and push after every completed logical unit

---

## Gotchas

- **No Prisma** — We use Supabase JS client directly, not Prisma ORM
- **No tenant portal** — Tenants use Buildium (managebuilding.com) for applications, login, and payments
- **No maintenance forms** — Not in scope for this site
- **Tailwind CSS v4** — Uses CSS-based config (`@theme inline` in globals.css), not tailwind.config.js
- **Mobile matters** — every UI change must account for sm/md/lg breakpoints
- **CSP is strict** — adding third-party resources requires updating next.config.ts headers
- **Serverless timeout**: 30s max for API routes
- **Resend not configured yet** — contact form saves to Supabase but does not send email yet
- **Turnstile not configured yet** — form protection is deferred
