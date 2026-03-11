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

**RentBing is a website for a company that owns, rents, and maintains its own properties.** It serves Binghamton University students and graduate students with off-campus housing in Binghamton, NY.

The site is a **hybrid**: marketing/listings on the front end, maintenance operations on the back end, with Buildium as the property management system of record.

### What this site does:
1. **Marketing / Listings** — Display available properties with photos, pricing, details; accept rental inquiries
2. **Maintenance Operations** — Accept maintenance requests from tenants; track request status; sync with Buildium; future AI triage
3. **Buildium Integration** — Two-way sync for properties and maintenance data

### What this site is NOT:
- A generic property management SaaS for third parties
- A tenant portal with accounting/payments (that's Buildium)
- An application processing system (applications link to Buildium's portal)

**Production URL**: https://www.rentbing.com
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
| **Property Management** | Buildium Open API (two-way sync) |
| **AI** | Anthropic Claude API (future: maintenance triage) |
| **Hosting** | Vercel |
| **Email** | Resend (deferred — not yet configured) |
| **Bot Protection** | Cloudflare Turnstile (deferred — not yet configured) |

**Important**: This project does NOT use Prisma. All database access goes through the Supabase JS client.

---

## Database Schema

| Table | Purpose | Source of Truth |
|-------|---------|-----------------|
| `properties` | Rental listings with Buildium link | Buildium (synced down) |
| `property_images` | Photos for each property | Website (Supabase Storage) |
| `inquiries` | Contact/rental inquiry submissions | Website (originates here) |
| `maintenance_requests` | Maintenance requests with AI fields | Website → Buildium (two-way) |
| `buildium_sync_log` | Audit trail for all sync operations | Website (log only) |

SQL migration: `supabase/migrations/001_initial_tables.sql`
Seed data: `supabase/seed.sql`

---

## Buildium Sync Architecture

### Properties
- **Source of truth**: Buildium
- **Direction**: Buildium → Website (periodic sync)
- Properties created on the website before Buildium link get `buildium_property_id = NULL`
- Once linked, Buildium data overwrites local fields (address, bedrooms, etc.)
- `buildium_last_synced_at` tracks freshness

### Maintenance Requests
- **Originates on**: Website
- **Syncs to**: Buildium (as a Task/Work Order)
- **Updates sync back**: Buildium status changes flow back to `maintenance_requests.status`
- `buildium_task_id` links the local record to Buildium
- `buildium_last_synced_at` tracks last sync

### Inquiries
- **Originates on**: Website
- **Future sync**: Can push to Buildium as a Prospect/Note
- `buildium_prospect_id` and `synced_to_buildium_at` track sync state

### Conflict Resolution
- Buildium is source of truth for **property data**
- Website is source of truth for **inquiry data** and **initial maintenance request**
- For maintenance status, Buildium wins (it's the operational system)
- `buildium_sync_log` records every sync for debugging

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
    (marketing)/        # Public pages (home, properties, contact, maintenance)
    api/                # API route handlers
  components/
    layout/             # Header, Footer
    ui/                 # Button, Card, Container, Input, Select, Textarea, Badge
    shared/             # Section, PageHero, FeatureCard, ServiceCard
    properties/         # ImageGallery (with lightbox)
    forms/              # ContactForm, MaintenanceForm
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
**React/Next.js**: Server components by default; `'use client'` only when needed.
**Styling**: Tailwind utility classes, mobile-first. Every layout must be responsive.
**Path alias**: `@/*` maps to `./src/*`.
**Database**: Supabase JS client for all DB access.
**Images**: Property images in Supabase Storage, referenced via `property_images` table.

---

## Git Workflow

- Develop on `claude/[description]-[sessionId]` branches
- Never push directly to `main`
- Auto-merge via GitHub Actions (claude/** → main)
- Commit and push after every completed logical unit

---

## Gotchas

- **No Prisma** — Supabase JS client directly, not Prisma ORM
- **No tenant portal** — Tenants use Buildium for applications, login, payments
- **Tailwind CSS v4** — Uses CSS-based config (`@theme inline` in globals.css), not tailwind.config.js
- **Mobile matters** — every UI change must account for sm/md/lg breakpoints
- **CSP is strict** — adding third-party resources requires updating next.config.ts headers
- **Serverless timeout**: 30s max for API routes
- **Resend not configured yet** — forms save to Supabase but don't send email yet
- **Turnstile not configured yet** — form protection is deferred
- **Buildium API not configured yet** — sync fields exist in schema but sync jobs are future work
