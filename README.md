# GulfFreelance

Gulf-focused Arabic and English job and freelance marketplace built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Local Setup

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without Supabase public configuration, public routes show the setup state; CI and public Playwright smoke tests do not require credentials.

For authenticated use, copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use only the public publishable/anon-compatible key in `NEXT_PUBLIC_*`. Never place a service-role or secret key in frontend code. `.env.local` is ignored by Git.

## Supabase Migration

For an empty, fresh Supabase project, review and run `supabase/migrations/20260917_rebuild_core.sql`.

For an existing project with data, do not run the fresh-install migration. Back up the project, review `supabase/BETA_MIGRATION_CHECKLIST.md`, and manually run `supabase/migrations/20261028_beta_hardening.sql` in Supabase SQL Editor. The migration is additive, retains data, and aborts on legacy ownership/data conditions that need human review. It has not been applied to any remote project from this repository.

Configure Supabase Auth site and redirect URLs for localhost and the deployed Vercel domain, including `/auth/callback` and password-update routes.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run verify
npm audit
```

The Playwright suite launches a local Next.js development server. Install its browser once with `npx playwright install chromium`. Authenticated E2E checks are optional and use `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`, and optionally `E2E_JOB_ID`; tests skip when credentials are not configured.

GitHub Actions runs lint, typecheck, build, and the public E2E suite on pushes and pull requests to `master`, without Supabase secrets.

## Beta Status

The MVP includes Supabase Auth flows, profiles and roles, jobs/applications/saved jobs, freelancer services/discovery, private CV storage and employer signed access, messaging/read state/Realtime refresh, dashboards, admin moderation, Arabic/English routes, RTL, search, SEO metadata, sitemap/robots, and RLS policies.

Payments, marketplace payouts, KYC, transactional email provider integration, and paid monitoring are intentionally not implemented. See [PROJECT_REPORT.md](PROJECT_REPORT.md) for verified scope and [BETA_CHECKLIST.md](BETA_CHECKLIST.md) for remaining account-side testing and deployment tasks.
