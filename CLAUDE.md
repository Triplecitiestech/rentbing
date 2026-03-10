# CLAUDE.md — AI Assistant Guide for Rent Bing

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

Rent Bing is a modern property management website and operational hub. It integrates with Buildium via its Open API to display properties, accept applications, and manage maintenance requests.

**Production URL**: https://www.rentbing.com
**Preview URL pattern**: https://<branch-name>-rentbing.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router), React, TypeScript (strict) |
| **Styling** | Tailwind CSS 4 with custom theme |
| **Database** | Supabase (PostgreSQL + Auth + Storage) — direct client, no Prisma |
| **Auth** | Supabase Auth (email/password for tenants, OAuth for admin) |
| **Email** | Resend |
| **Bot Protection** | Cloudflare Turnstile |
| **Property Management** | Buildium Open API (Phase 4) |
| **AI** | Anthropic Claude API (Phase 6) |
| **Hosting** | Vercel |

**Important**: This project does NOT use Prisma. All database access goes through the Supabase JS client (`@supabase/supabase-js` and `@supabase/ssr`).

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
    (marketing)/        # Public pages (home, properties, about, contact, apply)
    portal/             # Tenant portal (auth required)
    admin/              # Staff portal (admin auth)
    api/                # API route handlers
    auth/               # Supabase auth pages
  components/
    layout/             # Header, Footer, Navigation
    sections/           # Hero, Features, CTA, Testimonials
    ui/                 # Button, Card, Container, Input
    shared/             # Section, FeatureCard, PageHero
    properties/         # PropertyCard, PropertyGrid, PropertyDetail
    forms/              # ContactForm, InquiryForm, ApplicationForm
    portal/             # Tenant dashboard components
    admin/              # Admin components
    seo/                # JSON-LD schemas, Breadcrumbs, AIMetadata
  lib/
    supabase/           # Supabase clients (server.ts, client.ts, admin.ts)
  config/               # Site metadata, contact config
  constants/            # Navigation, property types
  types/                # TypeScript type definitions
  utils/                # cn.ts (clsx + tailwind-merge)
  hooks/                # Custom React hooks
  middleware.ts         # Security headers, bot blocking
tests/
  e2e/                  # Playwright tests
```

---

## Code Conventions

**TypeScript**: Strict mode, no `any`. Interfaces for all props/params.

**React/Next.js**: Server components by default; add `'use client'` only when needed.

**Styling**: Tailwind utility classes, mobile-first. Every layout must be responsive.

**Path alias**: `@/*` maps to `./src/*`.

**Database**: Supabase JS client for all DB access. Use `createClient()` from `@/lib/supabase/server` in server components/API routes, `@/lib/supabase/client` in client components, `createAdminClient()` for service-role operations.

---

## Git Workflow

- Develop on `claude/[description]-[sessionId]` branches
- Never push directly to `main`
- Auto-merge via GitHub Actions (claude/** → main)
- Commit and push after every completed logical unit

---

## Implementation Phases

### Phase 1 — Foundation & Infrastructure (CURRENT)
Next.js project, Tailwind theme, Supabase client setup, folder structure, middleware, CLAUDE.md, deployment pipeline, health check endpoint.

### Phase 2 — Public Marketing Site
### Phase 3 — Forms & Lead Capture
### Phase 4 — Buildium Integration
### Phase 5 — Operational Tooling
### Phase 6 — AI Workflow Integration

---

## Gotchas

- **No Prisma** — We use Supabase JS client directly, not Prisma ORM
- **Tailwind CSS v4** — Uses CSS-based config (`@theme inline` in globals.css), not tailwind.config.js
- **Buildium requires Premium plan** ($375+/month)
- **Mobile matters** — every UI change must account for sm/md/lg breakpoints
- **CSP is strict** — adding third-party resources requires updating next.config.ts headers
- **Serverless timeout**: 30s max for API routes
