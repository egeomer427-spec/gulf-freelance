# GulfFreelance Beta Checklist

## Code Complete

- [x] Existing Next.js/Supabase MVP retained; payments, payouts, KYC, transactional-email providers, and paid monitoring are out of scope.
- [x] CI runs lint, typecheck, production build, and public E2E smoke tests on pushes and pull requests to `master`.
- [x] Public Playwright coverage exercises locale routes/RTL, marketplace/auth pages, 404 handling, mobile layout, health endpoint, and security headers.
- [x] Optional authenticated Playwright checks use only `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`, and optionally `E2E_JOB_ID`; they skip when values are absent.
- [x] Root loading, error, global error, and not-found UI states exist.
- [x] Health endpoint exposes only app status and whether public Supabase configuration is present.
- [x] Production security headers are configured without a brittle Content Security Policy.
- [x] Server actions validate supported country/currency values, salary ranges, UUID identifiers, CV ownership, and own-job application attempts.
- [x] Existing RLS protections are retained in the fresh-install migration; an additive, data-preserving hardening migration is provided for existing projects.
- [x] Private/account routes are marked noindex; robots exclusions cover account and authenticated listing forms.
- [x] User-facing mobile menu and new moderation labels support English and Arabic.
- [x] Automated accessibility affordances include focus-visible styling, form labels, alert/status semantics, and pending submit states.

## User/Account-Side Tasks

- [ ] Back up the existing Supabase project and inspect legacy schema/policies.
- [ ] Follow `supabase/BETA_MIGRATION_CHECKLIST.md` and manually run `supabase/migrations/20261028_beta_hardening.sql` in Supabase SQL Editor. Do not run the fresh-install migration on the existing project.
- [ ] Create local `.env.local` using `.env.example`; provide only the Supabase project URL and public publishable key. Never expose a secret/service-role key to the browser. The repository ignores `.env.local`.
- [ ] Configure Supabase Auth site URL and redirect allowlist for localhost and the deployed domain, including `/auth/callback` and locale password-update paths.
- [ ] Test signup, email confirmation, login, logout, reset, and password update.
- [ ] Test an employer account: profile, job creation, applicant review/status, and CV access only for applicants to its own job.
- [ ] Test a freelancer/job-seeker account: profile, service creation/discovery, job search/filter, saved job, CV upload/delete, and application submission.
- [ ] Verify a user cannot apply to their own job and cannot select another user's CV.
- [ ] Test messaging between two accounts, unread counts, read state, and Realtime refresh.
- [ ] Test admin user suspension, report triage, verification decisions, and job/service moderation.
- [ ] Test English and Arabic layouts on desktop and a narrow mobile viewport.
- [ ] Configure Vercel environment variables with public Supabase URL/key and the canonical site URL.
- [ ] Deploy to Vercel and verify `/api/health`, auth redirects, job/service detail metadata, sitemap, robots, and HTTP security headers.
- [ ] Optional authenticated E2E: configure `E2E_USER_EMAIL` and `E2E_USER_PASSWORD`; optionally set `E2E_JOB_ID` to a public active job UUID.
