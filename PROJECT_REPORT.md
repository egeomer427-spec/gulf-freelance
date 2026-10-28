# GulfFreelance Reconstruction Report

Date: 2026-09-17

## Rebuilt to the previous functional level

- Next.js App Router + TypeScript + Tailwind.
- English and Arabic locale routes with RTL layout for Arabic.
- Supabase SSR/browser clients with graceful unconfigured state.
- Registration, login, logout, email confirmation callback, password reset/update.
- Profiles and multi-purpose account roles.
- Job listing search/filter, job creation, job detail, saved jobs.
- Job applications with CV selection and employer-side applicant status management.
- Freelancer service listing search/filter, service creation and detail pages.
- Freelancer discovery.
- Private CV upload/delete through Supabase Storage with 5 MB/type checks.
- Employer signed CV access protected by RLS/application ownership.
- One-to-one messaging, read state fields and Supabase Realtime refresh.
- User dashboard with job/service/application/message summaries.
- Admin moderation foundation for users, reports and verification requests.
- Sitemap, robots and JobPosting structured data.
- Placeholder privacy/terms pages.
- Full SQL schema, indexes, triggers, RLS and storage policies.

## Intentionally not implemented

- Payments / marketplace payouts / KYC.
- Real production legal text.
- Advanced reviews/orders/notifications/email delivery.
- Production monitoring/analytics.
- Automated E2E test suite.

## Mandatory before beta

1. Create or select the Supabase project.
2. Run `supabase/migrations/20260917_rebuild_core.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and add the real public Supabase URL + publishable key. Never add a service-role/secret key to `NEXT_PUBLIC_*`.
4. Configure Supabase Auth site URL and redirect URLs for localhost and the future Vercel domain.
5. Run `npm install` after copying this rebuild over the blank project.
6. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
7. Browser-test two normal accounts (employer + job seeker/freelancer): signup, email verification, profile, post job, upload CV, apply, employer opens CV, messaging/read state, service creation, saved jobs.
8. Promote one test user to admin only in Supabase SQL for admin testing: `update public.profiles set role='admin' where id='<USER_UUID>';`
9. Push the verified project to GitHub.
10. Deploy to Vercel and configure production environment variables.

## Note

This is a reconstruction from PROJECT_CONTEXT.md and the recorded previous project state after the local files were lost during a Windows format. It is not a byte-for-byte copy of the lost project.
