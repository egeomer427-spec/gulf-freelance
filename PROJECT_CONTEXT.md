# PROJECT_CONTEXT.md

## 0. Purpose of this document

This file is the single source of truth for ChatGPT, Codex, and any future developer or coding agent working on this project.

Before changing code, every agent MUST:
1. Read this file completely.
2. Inspect the existing repository.
3. Audit the current implementation before assuming anything is missing.
4. Preserve working features.
5. Prefer incremental changes over rewrites.
6. Prefer mature, actively maintained open-source libraries and repositories over rebuilding common infrastructure from scratch.
7. Keep the project deployable on Vercel.
8. Never commit secrets, private keys, service-role keys, or production credentials.

---

# 1. Product vision

## Working brand direction

The product is NOT just a Fiverr/Bionluk clone.

The long-term goal is to create a Gulf-region digital employment brand that combines:

### A. Freelance Marketplace
- Freelancers create service listings.
- Clients discover and purchase services.
- Users can message each other.
- Orders can be tracked.
- Ratings and reviews can be added.
- Payments can later be handled through a marketplace-safe payment flow.

### B. Job Marketplace
- Employers create full-time, part-time, temporary, remote, and local job listings.
- Job seekers create profiles and CVs.
- Job seekers apply to jobs.
- Employers manage applicants.
- Saved jobs, alerts, candidate search, and employer dashboards can be added.

### C. Shared identity layer
One account should eventually allow a user to:
- Find a job.
- Hire a freelancer.
- Sell freelance services.
- Create a CV.
- Apply to jobs.
- Message employers, candidates, clients, and freelancers.
- Switch between job-seeker, freelancer, employer, and client roles where appropriate.

The product should become a regional employment ecosystem rather than a single-purpose clone.

---

# 2. Geographic strategy

Primary target region:

1. United Arab Emirates
2. Saudi Arabia
3. Qatar
4. Kuwait
5. Bahrain
6. Oman

Possible later expansion:
- Jordan
- Egypt
- Lebanon
- Iraq
- Morocco
- Tunisia
- Other Arabic-speaking markets

## Positioning

The product should NOT try to compete globally with Fiverr, Upwork, LinkedIn, or Indeed from day one.

The positioning is:

> A Gulf-focused, Arabic + English employment and freelance platform built specifically for the regional market.

Advantages to emphasize:
- Arabic-first UX.
- English support.
- RTL support.
- Gulf-specific locations and currencies.
- Local employer/freelancer discovery.
- Region-specific trust, verification, and moderation.
- Unified jobs + freelance experience.

---

# 3. Language and localization

Required from architecture level:

## Primary languages
- Arabic
- English

## Later
- Turkish may be added for users seeking Gulf opportunities.

## Requirements
- Arabic RTL support from the beginning.
- Locale-aware routing.
- Localized dates.
- Localized currencies.
- Translatable UI text.
- No hard-coded UI strings when avoidable.

Recommended library:
- next-intl
- Repository: https://github.com/amannn/next-intl

Next.js 16.x compatibility must be checked before upgrades.

---

# 4. Current known project state

IMPORTANT:
Do not assume this section reflects the entire codebase.
Codex must audit the repository because additional features may already exist.

## Confirmed working / previously implemented

- Next.js project created.
- Current project was created with Next.js 16.3.x during development.
- TypeScript enabled.
- Tailwind CSS enabled.
- App Router enabled.
- Basic landing page exists.
- Navbar exists.
- Login route exists.
- Register route exists.
- ServiceCard component exists.
- FreelancerCard component exists.
- Basic freelance landing UI exists.
- Messaging system was added and verified.
- The project is intended to deploy on Vercel.

## Must be audited before continuing

Codex must inspect whether these are already implemented:

- Supabase client setup.
- Supabase SSR setup.
- Supabase Auth.
- Real registration.
- Real login/logout.
- Session persistence.
- User profiles.
- Role system.
- Database schema.
- RLS policies.
- Freelancer service CRUD.
- Job listing CRUD.
- Job applications.
- Employer dashboard.
- Freelancer dashboard.
- Admin dashboard.
- CV upload/builder.
- File storage.
- Search.
- Filters.
- Favorites.
- Reviews.
- Notifications.
- Payments.
- Arabic localization.
- RTL.
- SEO.
- Analytics.
- Monitoring.
- Email.
- Vercel production configuration.
- Tests.

DO NOT rebuild anything already present and working.

---

# 5. Technical architecture

## Preferred core stack

### Frontend / Full-stack framework
- Next.js 16.x
- TypeScript
- App Router
- Server Components by default
- Client Components only where interaction requires them

Official repository:
https://github.com/vercel/next.js

### Styling
- Tailwind CSS
- shadcn/ui
- Radix primitives through shadcn where appropriate

shadcn/ui:
https://github.com/shadcn-ui/ui

### Backend / Database / Auth / Storage / Realtime
Preferred:
- Supabase

Use:
- PostgreSQL database
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Row Level Security
- Database functions/triggers only where appropriate

Supabase:
https://github.com/supabase/supabase

Supabase JS:
https://github.com/supabase/supabase-js

Supabase SSR:
https://github.com/supabase/ssr

IMPORTANT:
Use @supabase/ssr for Next.js SSR patterns.
Do NOT introduce deprecated @supabase/auth-helpers-* packages.

### Deployment
- Vercel

The app must remain Vercel-compatible at every major milestone.

---

# 6. Authentication strategy

Preferred:
Supabase Auth.

Required flows:
- Sign up.
- Sign in.
- Sign out.
- Email verification.
- Password reset.
- Session refresh.
- Protected dashboard routes.
- Profile completion.
- Optional OAuth later.

Potential OAuth:
- Google
- Apple
- LinkedIn only if its current API/policy fits the product.

## Security requirements
- Never expose Supabase service-role/secret keys to the browser.
- Browser uses publishable/anon-compatible public key only.
- Server-only secrets must remain server-side.
- Environment variables belong in .env.local locally and Vercel Environment Variables in production.
- .env.local must remain in .gitignore.
- RLS is mandatory on user-owned tables.

---

# 7. Database model

Codex must inspect current migrations/schema before creating anything.

Recommended conceptual schema:

## Core identity

### profiles
- id UUID references auth.users
- username
- display_name
- avatar_url
- bio
- country
- city
- preferred_language
- account_type
- created_at
- updated_at

Possible account types:
- job_seeker
- freelancer
- employer
- client
- admin

Do not force one permanent role if multi-role accounts are beneficial.

## Freelancer marketplace

### freelancer_profiles
- user_id
- headline
- skills
- experience_level
- hourly_rate optional
- availability
- languages
- verified

### services
- id
- seller_id
- title
- slug
- description
- category_id
- base_price
- currency
- delivery_days
- status
- created_at

### service_packages
For basic / standard / premium package models if needed.

### service_images
### favorites
### orders
### order_messages or conversation linkage
### reviews

## Job marketplace

### employer_profiles
- user_id
- company_name
- logo_url
- website
- company_size
- industry
- country
- city
- verified

### jobs
- id
- employer_id
- title
- slug
- description
- employment_type
- workplace_type
- salary_min
- salary_max
- currency
- country
- city
- experience_level
- status
- published_at
- expires_at

Employment types:
- full_time
- part_time
- contract
- temporary
- internship

Workplace types:
- onsite
- hybrid
- remote

### job_applications
- job_id
- applicant_id
- cv_id
- cover_letter
- status
- created_at

Application statuses:
- submitted
- viewed
- shortlisted
- interview
- rejected
- hired
- withdrawn

### saved_jobs

## CV system

### cvs
- id
- user_id
- title
- file_url optional
- structured_data JSONB optional
- visibility
- updated_at

A structured CV builder can be added later.

## Messaging

Messaging is confirmed as added and verified.

Codex MUST inspect the current messaging implementation before modifying it.

Conceptual model may include:
- conversations
- conversation_members
- messages
- message_attachments
- read receipts

Do not replace a working messaging design without a strong technical reason.

## Admin / moderation

Potential tables:
- reports
- moderation_actions
- verification_requests
- audit_logs
- blocked_users

---

# 8. Row Level Security requirements

RLS must be treated as a core requirement, not optional cleanup.

Examples:

## profiles
- Public users can read only intended public profile fields.
- Users can update only their own profile.

## services
- Published services may be publicly readable.
- Sellers can create/update/delete only their own services.

## jobs
- Published jobs can be public.
- Employers can modify only their own jobs.

## applications
- Applicant can see their own applications.
- Employer can see applications to jobs they own.
- Other users cannot access applications.

## messages
- Only conversation members can read/write messages.

## orders
- Only buyer, seller, and authorized admin roles can access an order.

RLS policies must be tested before production deployment.

---

# 9. GitHub-first development strategy

Goal:
Reuse mature open-source infrastructure where doing so saves time and reduces bugs.

IMPORTANT:
"Use maximum GitHub resources" does NOT mean cloning many complete apps into one project.

Rules:
1. Prefer libraries, components, patterns, and isolated modules.
2. Do not combine conflicting full application starters.
3. Check licenses before production use.
4. Prefer MIT / Apache-2.0 / similarly permissive licenses.
5. Check maintenance activity before adopting a repo.
6. Avoid archived/deprecated repositories.
7. Avoid introducing two libraries that solve the same problem unless there is a concrete reason.
8. Codex must explain why a new dependency is necessary before adding it.

---

# 10. Recommended open-source repositories

## 10.1 Core framework

### Next.js
https://github.com/vercel/next.js

Use for:
- App Router
- Server Components
- Server Actions where appropriate
- Route handlers
- SEO
- Vercel deployment

---

## 10.2 UI system

### shadcn/ui
https://github.com/shadcn-ui/ui

PRIMARY UI component source.

Use for:
- Buttons
- Forms
- Dialogs
- Sheets
- Cards
- Dropdowns
- Tabs
- Commands
- Tables
- Tooltips
- Navigation
- Skeletons
- Toast integration patterns

Do not blindly copy an entire theme.
Build a consistent Gulf brand design system.

### Magic UI
https://github.com/magicuidesign/magicui

Use selectively for:
- Landing page polish
- Hero effects
- Marketing sections
- Small animations

Do NOT overuse animations in dashboards or critical workflows.

### Lucide
https://github.com/lucide-icons/lucide

Primary icon set.

---

# 11. Admin panel strategy

## Preferred admin framework: Refine

Repository:
https://github.com/refinedev/refine

Use for:
- Admin resource CRUD.
- User moderation.
- Job moderation.
- Service moderation.
- Reports.
- Verification requests.
- Admin tables.
- Filters.
- Admin forms.

Why preferred:
- React ecosystem.
- Resource-oriented admin architecture.
- Works well with REST/data providers and can be adapted for Supabase.
- More suitable to our app than old jQuery/admin templates.

IMPORTANT:
Do not force Refine into the public-facing user dashboard.
Use it mainly for internal admin/back-office.

## UI inspiration / component source: shadcn-admin

Repository:
https://github.com/satnaing/shadcn-admin

This is useful as:
- Dashboard UX inspiration.
- Sidebar/header patterns.
- Responsive admin patterns.
- RTL-aware component references.

IMPORTANT:
It is Vite/TanStack-based rather than our Next.js app.
DO NOT replace the Next.js application with it.
Borrow design/component patterns only.

## Avoid as primary architecture
AdminLTE may be used only for design reference if needed.
Do not make it the primary admin architecture because Refine + shadcn better matches the TypeScript/React stack.

---

# 12. Forms and validation

## React Hook Form
https://github.com/react-hook-form/react-hook-form

Use for complex client-side forms:
- Registration profile completion.
- Job posting.
- Service creation.
- Employer profile.
- CV builder.

## Zod
https://github.com/colinhacks/zod

Use for:
- Shared validation schemas.
- Form validation.
- Server input validation.
- API/route validation.

Preferred combination:
React Hook Form + Zod.

Do not rely only on browser validation.

---

# 13. Data fetching and tables

## TanStack Table
https://github.com/TanStack/table

Use for:
- Admin data grids.
- Employer applicant tables.
- Orders.
- Job management.
- Service management.
- User lists.

## TanStack Query
https://github.com/TanStack/query

Use only where client-side server-state caching provides real value.

Do NOT add it automatically if Server Components/Supabase server queries already cover a flow cleanly.

Good candidates:
- Infinite search results.
- Client-heavy dashboards.
- Optimistic updates.
- Background refresh.

---

# 14. Rich text

## Tiptap
https://github.com/ueberdosis/tiptap

Potential use:
- Job descriptions.
- Service descriptions.
- Employer descriptions.
- Rich CV sections.

Security:
Sanitize output.
Do not store/render arbitrary unsafe HTML.

---

# 15. File uploads

Preferred first choice:
Supabase Storage.

Use for:
- Avatars.
- Employer logos.
- Service images.
- CV files.
- Portfolio files.
- Message attachments where appropriate.

For large/resumable files, consider tus:
https://github.com/tus/tus-js-client

Do not add a separate file platform unless Supabase Storage becomes insufficient.

---

# 16. Messaging

CURRENT STATUS:
Messaging system was added and verified.

Codex instructions:
- Audit current conversations/messages schema.
- Audit realtime subscription logic.
- Audit authorization.
- Audit RLS.
- Audit unread/read handling.
- Do not rewrite unless broken.

Potential later enhancements:
- Typing state.
- Online presence.
- Read receipts.
- Attachments.
- Blocking.
- Reporting.
- Notification integration.

Supabase Realtime should remain preferred if current implementation already uses it.

---

# 17. Notifications

## In-app
Use database-backed notifications where needed.

Potential events:
- New message.
- New job application.
- Application status update.
- New order.
- Order delivery.
- New review.
- Verification result.

## Toast UI
Sonner:
https://github.com/emilkowalski/sonner

Use for temporary UI feedback.

---

# 18. Email

Recommended:
React Email
https://github.com/resend/react-email

Potential provider:
Resend

Use cases:
- Email verification UX.
- Password reset.
- Job application notifications.
- New message summary.
- Employer notifications.
- Order lifecycle.
- Security alerts.

Keep email provider behind a small service abstraction to allow replacement.

---

# 19. Search

MVP:
Start with PostgreSQL/Supabase queries.

Possible:
- PostgreSQL full-text search.
- pg_trgm for fuzzy text matching where appropriate.

Only introduce an external search engine after measured need.

Future options:
- Typesense
- Meilisearch
- Algolia

Do not prematurely add search infrastructure.

Search targets:
- Jobs.
- Services.
- Freelancers.
- Employers.

Filters:
- Country.
- City.
- Category.
- Salary.
- Price.
- Employment type.
- Remote/onsite.
- Rating.
- Experience.
- Language.

---

# 20. Payments

Do NOT rush marketplace payments.

Payments introduce:
- KYC.
- Payouts.
- Chargebacks.
- Refunds.
- Marketplace compliance.
- Regional payment differences.
- Tax/accounting complexity.

Phase 1 can launch without integrated marketplace payments if necessary.

Potential payment providers must be researched at implementation time for current Gulf support.

Candidates to research:
- Stripe Connect
- Checkout.com
- PayTabs
- Moyasar
- Tap Payments

Never assume a provider supports marketplace payouts in every target country.

Codex must NOT implement real payment processing without a documented payment architecture.

---

# 21. Currency

Support currency as data, not hard-coded UI.

Initial Gulf currencies:
- AED
- SAR
- QAR
- KWD
- BHD
- OMR

Possibly:
- USD

Money values:
Prefer integer minor units where applicable, or properly constrained NUMERIC fields in PostgreSQL.

Never store money in floating point.

---

# 22. Country/location model

Create a stable country model rather than embedding free text everywhere.

Initial GCC codes:
- AE
- SA
- QA
- KW
- BH
- OM

Cities can be normalized later.

Do not require Google Maps just to launch an MVP.

---

# 23. User dashboards

Do not use Refine for normal customers unless it clearly improves UX.

Create purpose-built Next.js dashboards.

## Freelancer dashboard
- Profile completion.
- Services.
- Orders.
- Messages.
- Reviews.
- Earnings later.
- Analytics later.

## Client dashboard
- Purchased services.
- Saved services.
- Messages.
- Reviews.
- Disputes later.

## Job seeker dashboard
- Profile.
- CV.
- Applications.
- Saved jobs.
- Alerts.
- Messages.

## Employer dashboard
- Company profile.
- Post job.
- Job listings.
- Applicants.
- Candidate status pipeline.
- Messages.
- Billing later.

---

# 24. Job marketplace MVP

Required end-to-end flow:

1. Employer registers.
2. Employer completes company profile.
3. Employer creates a job.
4. Job becomes visible according to moderation rules.
5. Job seeker searches jobs.
6. Job seeker opens job detail.
7. Job seeker applies.
8. Employer sees applicants.
9. Employer changes applicant status.
10. Job seeker sees status changes.

Do not build secondary features until this flow works end-to-end.

---

# 25. Freelance marketplace MVP

Required end-to-end flow:

1. Freelancer registers.
2. Freelancer completes freelancer profile.
3. Freelancer creates service.
4. Client searches services.
5. Client views service.
6. Client messages freelancer.
7. Order flow added when payment/order model is ready.
8. Completion/review flow added.

Messaging already exists and should connect cleanly to this flow.

---

# 26. CV system

MVP:
- Upload PDF CV.
- Store securely in Supabase Storage.
- Job seeker selects CV when applying.

Later:
- Built-in CV builder.
- Multiple CV versions.
- Arabic + English CV.
- Export to PDF.
- Public/private visibility.

Do not build complex PDF generation before basic job applications work.

---

# 27. Verification and trust

High importance for regional jobs.

Future verification:
- Email verified.
- Phone verified.
- Employer verified.
- Freelancer verified.
- Company registration verification where legally and operationally viable.

Trust & safety:
- Report job.
- Report service.
- Report user.
- Block user.
- Admin moderation.
- Scam detection rules.
- Suspicious link filtering later.

---

# 28. SEO

Jobs are a major SEO opportunity.

Requirements:
- Server-rendered public job pages.
- Service pages.
- Freelancer public profiles.
- Employer public profiles.
- Clean slugs.
- Metadata.
- Open Graph.
- Canonical URLs.
- Sitemap.
- robots.txt.
- JobPosting structured data where appropriate and compliant.
- Organization schema for employers where appropriate.

Do not make public listings client-only pages.

---

# 29. Analytics

Recommended:
Vercel Analytics for basic deployment metrics.

Optional product analytics later:
- PostHog or another suitable provider.

Track:
- Search.
- Job views.
- Service views.
- Applications.
- Registration funnel.
- Employer posting funnel.
- Message initiation.
- Conversion events.

Respect privacy requirements.

---

# 30. Monitoring

Sentry JavaScript:
https://github.com/getsentry/sentry-javascript

Use before production for:
- Frontend errors.
- Server errors.
- Route failures.
- Source maps if configured securely.

Do not leak PII or message contents into error logs.

---

# 31. Testing

## End-to-end
Playwright:
https://github.com/microsoft/playwright

Critical E2E tests:
- Register.
- Login.
- Logout.
- Job creation.
- Job application.
- Service creation.
- Messaging.
- Authorization boundaries.
- Arabic route.
- English route.

Production should not depend only on manual testing.

---

# 32. Mobile strategy

Phase 1:
Responsive/PWA-quality web experience.

Do not immediately split development into separate web and mobile codebases.

Later mobile app:
- React Native + Expo is preferred candidate.
- Reuse backend/database/auth architecture.
- Web and mobile share Supabase backend.

---

# 33. Vercel deployment architecture

The repository must be deployable with normal Vercel Git integration.

## Requirements
- Build must succeed with `npm run build`.
- No dependence on local machine paths.
- No secrets committed.
- Environment variables documented.
- Public environment variables clearly separated from server secrets.
- No Node-only package used in Edge Runtime accidentally.
- Dynamic routes compatible with Vercel.
- Upload flow uses Supabase Storage, not local disk.

## Environment variable naming example

Public:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

Server-only if ever required:
SUPABASE_SECRET_KEY=

IMPORTANT:
Never expose secret/service-role keys through NEXT_PUBLIC_*.

---

# 34. Environment files

Required:

.env.example
- Contains variable names.
- Contains fake/sample values only.
- Safe to commit.

.env.local
- Contains real local credentials.
- Never committed.

Vercel:
- Add real values using project environment settings.

---

# 35. Recommended folder architecture

Codex must preserve current structure if already better.

Suggested direction:

app/
  [locale]/
    page.tsx
    jobs/
    freelance/
    login/
    register/
    dashboard/
  api/

components/
  ui/
  layout/
  jobs/
  freelance/
  messaging/
  forms/
  shared/

lib/
  supabase/
    client.ts
    server.ts
    middleware.ts or current Next.js-compatible equivalent
  auth/
  validation/
  permissions/
  constants/
  utils/

features/
  jobs/
  freelance/
  messaging/
  profiles/
  applications/
  admin/

types/

messages/
  ar.json
  en.json

supabase/
  migrations/
  seed.sql optional

public/

Do not reorganize the whole repo solely to match this example.
Only refactor when the existing structure becomes a real maintenance problem.

---

# 36. UI/UX direction

Brand feel:
- Premium Gulf tech platform.
- Clean.
- Trustworthy.
- Modern.
- Not overly playful.
- Mobile-first.
- Arabic typography respected.
- Dark mode optional.
- Strong accessibility.

Public homepage should communicate two paths clearly:

## Find Work
- Browse jobs.
- Create CV.
- Apply.

## Sell Your Skills
- Create freelance service.
- Find clients.

Potential third path:
## Hire Talent
- Post a job.
- Hire freelancer.

This is a key differentiator.

---

# 37. Homepage structure

Suggested:

1. Navbar
2. Locale switcher
3. Hero
4. Search with Jobs / Freelance toggle
5. GCC country selector
6. Popular job categories
7. Popular freelance categories
8. Featured jobs
9. Featured services
10. Trusted employers
11. How it works
12. Safety/trust section
13. CTA for employers
14. CTA for freelancers
15. Footer

Avoid fake platform statistics in production.

---

# 38. Arabic UX

Requirements:
- dir="rtl" for Arabic locale.
- Layout direction must switch correctly.
- Icons/arrows that imply direction must mirror where needed.
- Forms must remain usable.
- Sidebars should behave naturally in RTL.
- Tables and pagination should be tested.
- Arabic font selection should be intentional.

Do not translate only visible text while leaving LTR layout broken.

---

# 39. Admin capabilities

Admin MVP:

## Users
- Search users.
- Suspend user.
- Review profile.
- Verify where applicable.

## Jobs
- View jobs.
- Approve/reject if moderation is enabled.
- Remove scam jobs.

## Services
- Review services.
- Hide/remove service.

## Reports
- User reports.
- Job reports.
- Service reports.
- Message-related reports only with strict privacy policy and appropriate access.

## Verification
- Employer verification requests.
- Freelancer verification later.

## Metrics
- Registrations.
- Active jobs.
- Applications.
- Active services.
- Messages count without exposing content by default.

---

# 40. What NOT to do

Codex must NOT:

- Rewrite the entire application because a starter repo looks nicer.
- Clone Fiverr/Upwork/LinkedIn copyrighted UI exactly.
- Add many UI frameworks.
- Use both Supabase and another backend without a real reason.
- Store passwords manually.
- Build custom cryptography.
- Disable RLS to make development easier.
- Put secret keys into frontend code.
- Commit `.env.local`.
- Use deprecated Supabase auth-helper packages.
- Introduce Redis before there is a demonstrated need.
- Introduce microservices for the MVP.
- Add Kubernetes.
- Add Elasticsearch before PostgreSQL search is tested.
- Add payment code before marketplace payment requirements are understood.
- Break messaging, which is currently reported as working.

---

# 41. Adoption priority for repositories

## USE NOW / HIGH PRIORITY
1. Next.js
2. Supabase + supabase-js + @supabase/ssr
3. Tailwind
4. shadcn/ui
5. Lucide
6. React Hook Form
7. Zod
8. next-intl

## USE WHEN FEATURE REQUIRES
9. Refine — admin
10. TanStack Table — large dashboards/admin tables
11. Tiptap — rich descriptions
12. Sonner — UI notifications
13. React Email — email templates
14. Sentry — production monitoring
15. Playwright — E2E testing
16. tus-js-client — resumable large uploads only if required
17. TanStack Query — only for client-heavy server state

## DESIGN REFERENCE / DO NOT CLONE AS CORE
18. shadcn-admin

## DEFER
- External search engine.
- Separate chat provider.
- Redis.
- Microservices.
- Native mobile application.
- Complex payment system.
- AI recommendations.

---

# 42. Alternatives to Supabase

Supabase remains the preferred option because it provides:
- PostgreSQL
- Auth
- Storage
- Realtime
- RLS
- Good fit with Next.js
- Fast MVP development

Alternatives should only be proposed with a concrete benefit.

Possible alternatives:
- Neon + Better Auth + S3/R2 + separate realtime stack
- Firebase
- Appwrite
- Convex

Why not preferred initially:
They increase architecture fragmentation or create migration complexity without a demonstrated need.

If Supabase becomes a bottleneck, document the bottleneck before migration.

---

# 43. Development phases

## Phase 0 — Audit current code
Codex must start here after reading this file.

Output:
- Existing routes.
- Existing components.
- Existing database schema.
- Existing Supabase configuration.
- Existing messaging architecture.
- Current build errors.
- Current runtime errors.
- Existing tests.
- Existing dependencies.
- Missing env vars.

No major rewrite.

## Phase 1 — Identity foundation
- Supabase connection verified.
- Auth verified.
- Registration.
- Login.
- Logout.
- Email verification.
- Protected routes.
- Profile table.
- Profile completion.
- Roles/account capabilities.
- RLS.

## Phase 2 — Freelance core
- Freelancer profile.
- Service create/edit/delete.
- Public services list.
- Service detail.
- Search/filter.
- Messaging integration.

## Phase 3 — Jobs core
- Employer profile.
- Job CRUD.
- Public jobs.
- Job search/filter.
- Job detail.
- Application submission.
- Applicant management.

## Phase 4 — Dashboards
- Job seeker.
- Employer.
- Freelancer.
- Client.

## Phase 5 — Admin
- Refine-based back-office.
- Moderation.
- Reports.
- Verification.
- Metrics.

## Phase 6 — Localization
If not already implemented:
- Arabic.
- English.
- RTL.
- Country/currency formatting.

Localization architecture should ideally be introduced earlier if routes/UI are already growing.

## Phase 7 — Trust and quality
- Verification.
- Reports.
- Blocking.
- Fraud/scam controls.
- Email notifications.
- Monitoring.
- Tests.

## Phase 8 — Monetization
- Featured jobs.
- Featured services.
- Employer subscription.
- Premium freelancer account.
- Marketplace commissions only after payment compliance design.

## Phase 9 — Production
- Vercel.
- Production Supabase.
- Domain.
- Backups.
- Analytics.
- Monitoring.
- Security review.
- SEO.
- Legal pages.
- Privacy policy.
- Terms.
- Cookie policy if needed.

## Phase 10 — Mobile
- React Native / Expo.
- Same Supabase backend.

---

# 44. Monetization strategy

Do not rely on a single revenue stream.

## Jobs
Potential:
- Paid job posting.
- Employer monthly plans.
- Featured job.
- Candidate database access.
- Verified employer badge / premium verification services if legally appropriate.

## Freelance
Potential:
- Commission on orders.
- Featured services.
- Freelancer subscriptions.
- Client business plans.

## Later
- CV premium tools.
- Training.
- Recruitment services.

Do not block initial growth with excessive monetization.

---

# 45. Marketplace launch strategy

Product must solve the supply/demand chicken-and-egg problem.

## Jobs
Prioritize employers first.
A job platform with users but no real jobs has low value.

Early goal:
- Seed real employers.
- Seed high-quality real job listings.
- Prevent scams.

## Freelance
Seed high-quality freelancers in a limited number of categories:
- Software
- Design
- Marketing
- Translation
- Video
- AI services

Avoid launching hundreds of empty categories.

---

# 46. Legal / compliance reminder

Before production launch, research current laws in target countries.

Potential areas:
- Marketplace regulations.
- Recruitment regulations.
- Employment advertising.
- Data privacy.
- Consumer protection.
- Payment/KYC obligations.
- Tax/VAT.
- Cross-border payouts.

The software architecture should not assume legal permission for every monetization feature.

Codex must not provide legal conclusions as facts.

---

# 47. Security checklist

Before production:

- RLS enabled.
- RLS policies tested.
- No service key leaked.
- Authorization tested server-side.
- Inputs validated with Zod or equivalent.
- File type/size validated.
- Rate limiting strategy considered.
- Abuse reporting.
- Secure password reset.
- Email verification.
- Open redirects prevented.
- User-generated HTML sanitized.
- Upload paths scoped by user.
- Admin authorization enforced server-side.
- Sensitive logs minimized.

---

# 48. Performance checklist

- Use Server Components where beneficial.
- Avoid unnecessary client components.
- Lazy-load heavy editors.
- Optimize images.
- Paginate/infinite-scroll result lists.
- Index common DB query fields.
- Avoid N+1 queries.
- Cache public data only when correctness allows.
- Avoid loading entire message history at once.

---

# 49. Git strategy

Recommended:
- main = production-ready
- feature branches for larger work

Before substantial changes:
- `git status`
- commit or stash working changes where appropriate

Commit examples:
- feat(auth): add Supabase registration
- feat(jobs): add job application flow
- feat(i18n): add Arabic RTL
- fix(messages): enforce member authorization
- chore(admin): add Refine resources

Never commit secrets.

---

# 50. Codex operating instructions

When Codex starts:

1. Read PROJECT_CONTEXT.md.
2. Inspect package.json.
3. Inspect app routes.
4. Inspect components.
5. Inspect Supabase code.
6. Inspect migrations/schema.
7. Inspect messaging.
8. Run git status.
9. Run lint/typecheck/build where scripts exist.
10. Produce an audit before changing architecture.

Then continue from the highest-priority unfinished task.

## Autonomous behavior

Codex may autonomously:
- Edit local project files.
- Create components.
- Create tests.
- Fix lint/type errors.
- Run local build/test commands.
- Add a dependency when clearly justified.
- Create migrations after auditing existing schema.

Codex must stop/ask before:
- Deleting major working features.
- Replacing the backend.
- Changing payment provider architecture.
- Running destructive production database migrations.
- Handling real production secrets.
- Spending money.
- Creating external paid resources.
- Making major product-scope decisions.

---

# 51. First Codex prompt after reading this file

Use:

Read PROJECT_CONTEXT.md completely.

You are the lead engineer for this Gulf-region jobs + freelance marketplace.

Important current context:
- This is an existing project, not a greenfield build.
- Do not recreate the app.
- Preserve all working features.
- Messaging has already been added and verified.
- We prefer mature open-source GitHub libraries/components when useful.
- Next.js + TypeScript + Tailwind + Supabase + Vercel are the preferred architecture.
- Arabic and English are required.
- Refine is preferred for the internal admin panel.
- Supabase is preferred for database, auth, storage, and realtime.

FIRST TASK:
Perform a complete read-only audit of the current repository.

Report:
1. Existing routes.
2. Existing components.
3. Existing features that work end-to-end.
4. Existing Supabase configuration.
5. Existing database tables/migrations.
6. Existing RLS policies.
7. Authentication status.
8. Messaging architecture and status.
9. Freelance marketplace status.
10. Job marketplace status.
11. Admin status.
12. Arabic/English/RTL status.
13. Current build/lint/type errors.
14. Missing environment variables.
15. Vercel deployment readiness.
16. Security concerns.
17. Duplicate/unnecessary dependencies.
18. The next 10 tasks in exact priority order.

Do not modify files during this audit.

---

# 52. Second Codex prompt after audit

After the audit is reviewed:

Continue from the current project state.

Work on the highest-priority unfinished feature from the approved plan.

Rules:
- Do not recreate existing working features.
- Prefer the repositories/libraries listed in PROJECT_CONTEXT.md.
- Do not add unnecessary dependencies.
- Keep the app Vercel-compatible.
- Keep Supabase RLS/security intact.
- Keep Arabic/RTL architecture in mind.
- Preserve messaging.
- Run relevant lint/type/build/tests.
- Fix errors you introduce.
- At the end, report exactly:
  - files changed
  - migrations created
  - dependencies added
  - tests run
  - remaining issues
  - recommended next task

---

# 53. Definition of MVP success

The MVP is not "finished" merely because pages exist.

MVP success requires these end-to-end paths:

## Auth
User can register, authenticate, log out, and persist a session.

## Freelance
Freelancer can create a service.
Client can discover it.
Client can open it.
Client and freelancer can message.

## Jobs
Employer can post a job.
Job seeker can discover it.
Job seeker can apply.
Employer can review the application.

## User profile
A user can manage basic identity/profile data.

## Admin
Admin can moderate core marketplace content.

## Localization
Arabic and English are usable, with correct RTL for Arabic.

## Production
The app builds successfully and can deploy to Vercel using production-safe environment configuration.

---

# 54. Definition of production-ready v1

Production-ready v1 additionally requires:
- Reliable RLS.
- Abuse/reporting tools.
- Monitoring.
- Email flows.
- Validation.
- Tests.
- SEO.
- Legal pages.
- Backup/recovery planning.
- Employer/job moderation strategy.
- Performance review.
- Mobile-responsive QA.
- Production environment separation.
- Domain/branding finalized.

---

# 55. Final principle

Build one coherent product.

Do not turn the project into a collection of unrelated GitHub repositories.

Use open source aggressively for:
- battle-tested primitives,
- UI components,
- admin tooling,
- validation,
- testing,
- infrastructure integrations.

But keep:
- one design system,
- one auth model,
- one database model,
- one permissions model,
- one product vision,
- one deployment architecture.

The goal is a maintainable Gulf employment platform, not a demo assembled from incompatible templates.
