# Existing Supabase Project Migration

Use this checklist for an existing Supabase project. The beta migration is additive and is not run by the application, CI, or this repository's build. Do not run the fresh-install migration against a project that already contains production or test data.

## Before SQL Editor

1. Confirm this is the intended Supabase project and take a database backup or point-in-time restore checkpoint.
2. In Supabase SQL Editor, inspect `public.profiles`, `jobs`, `services`, `cvs`, `job_applications`, `saved_jobs`, `conversations`, `messages`, `reports`, and `verification_requests`.
3. Review existing RLS policies on those tables and `storage.objects`. The migration replaces only GulfFreelance-named policies and adds restrictive guards; unrelated named policies remain, but the restrictive guards limit access on the covered tables and CV bucket.
4. Check for legacy columns or ownership data that do not match the current schema. The migration deliberately aborts if required owner/relationship data is missing, if mandatory listing fields are null, if CV storage paths do not begin with the owning user's UUID, if salary ranges are reversed, or if duplicate applications/conversations prevent safe unique indexes.
5. If a preflight check fails, stop and export the affected rows for review. Do not remove rows or guess ownership mappings. Adjust only after the account owner has approved a documented mapping.

## Run the migration

1. Open `supabase/migrations/20261028_beta_hardening.sql` and review it in full.
2. Paste the complete file into Supabase SQL Editor for the selected project and run it once. It uses a transaction; a raised preflight error rolls back the migration.
3. Confirm SQL Editor reports success. Do not run `20260917_rebuild_core.sql` on an existing project; that file is for a fresh installation only.
4. Confirm the `cvs` Storage bucket remains private, `messages` remains in `supabase_realtime`, and the named RLS policies/triggers were created.
5. Run the application workflow checklist in `../BETA_CHECKLIST.md` with two normal accounts and an admin account.

## Important

- This migration preserves table rows and Auth users. It does not truncate, delete, reset Auth, or use a service-role key in application code.
- It does create missing core tables with current MVP columns. Existing nonstandard schemas may require a reviewed data mapping before the migration can complete.
- The migration does not automatically migrate files between Storage paths or repair duplicate records.
- Supabase is not contacted or modified by `npm install`, lint, typecheck, build, CI, or Playwright public smoke tests.
