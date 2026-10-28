# GulfFreelance

Gulf-focused Arabic + English jobs and freelance marketplace rebuilt after the previous local project was lost.

## 1. Install

```bash
npm install
```

## 2. Supabase

Create a Supabase project, then open SQL Editor and run:

`supabase/migrations/20260917_rebuild_core.sql`

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_*` variable.

In Supabase Authentication URL Configuration, add local redirect URLs such as:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/en/update-password`
- `http://localhost:3000/ar/update-password`

## 3. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Verify before GitHub/Vercel

```bash
npm run lint
npm run typecheck
npm run build
```

See `PROJECT_REPORT.md` for the reconstruction status and browser-test checklist.
