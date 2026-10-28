-- Additive beta hardening for an existing GulfFreelance Supabase project.
-- This migration does not drop tables, delete rows, truncate data, or reset Auth.
-- Review BETA_MIGRATION_CHECKLIST.md before running in SQL Editor.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  country text,
  city text,
  preferred_language text not null default 'en',
  role text not null default 'job_seeker',
  headline text,
  skills text[] not null default '{}',
  verified boolean not null default false,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  country text not null,
  city text,
  job_type text not null,
  salary_min numeric,
  salary_max numeric,
  currency text not null default 'AED',
  remote boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  base_price numeric not null default 0,
  currency text not null default 'AED',
  delivery_days integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  file_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  cv_id uuid references public.cvs(id) on delete set null,
  cover_letter text not null default '',
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_jobs (
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, job_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_one uuid not null references public.profiles(id) on delete cascade,
  user_two uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'profile',
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Add columns used by the current application when an earlier project schema lacks them.
-- Existing rows are preserved; legacy ownership values are intentionally not guessed.
alter table public.profiles
  add column if not exists username text,
  add column if not exists display_name text,
  add column if not exists avatar_url text,
  add column if not exists bio text,
  add column if not exists country text,
  add column if not exists city text,
  add column if not exists preferred_language text not null default 'en',
  add column if not exists role text not null default 'job_seeker',
  add column if not exists headline text,
  add column if not exists skills text[] not null default '{}',
  add column if not exists verified boolean not null default false,
  add column if not exists is_suspended boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.jobs
  add column if not exists employer_id uuid,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists country text,
  add column if not exists city text,
  add column if not exists job_type text,
  add column if not exists salary_min numeric,
  add column if not exists salary_max numeric,
  add column if not exists currency text not null default 'AED',
  add column if not exists remote boolean not null default false,
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.services
  add column if not exists seller_id uuid,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists base_price numeric,
  add column if not exists currency text not null default 'AED',
  add column if not exists delivery_days integer not null default 1,
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.cvs
  add column if not exists user_id uuid,
  add column if not exists title text,
  add column if not exists file_path text,
  add column if not exists file_name text,
  add column if not exists mime_type text,
  add column if not exists size_bytes bigint,
  add column if not exists created_at timestamptz not null default now();

alter table public.job_applications
  add column if not exists job_id uuid,
  add column if not exists applicant_id uuid,
  add column if not exists cv_id uuid,
  add column if not exists cover_letter text not null default '',
  add column if not exists status text not null default 'submitted',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.saved_jobs
  add column if not exists user_id uuid,
  add column if not exists job_id uuid,
  add column if not exists created_at timestamptz not null default now();

alter table public.conversations
  add column if not exists user_one uuid,
  add column if not exists user_two uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.messages
  add column if not exists conversation_id uuid,
  add column if not exists sender_id uuid,
  add column if not exists body text,
  add column if not exists is_read boolean not null default false,
  add column if not exists read_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

alter table public.reports
  add column if not exists reporter_id uuid,
  add column if not exists target_type text,
  add column if not exists target_id uuid,
  add column if not exists reason text,
  add column if not exists details text,
  add column if not exists status text not null default 'open',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.verification_requests
  add column if not exists user_id uuid,
  add column if not exists kind text not null default 'profile',
  add column if not exists notes text,
  add column if not exists status text not null default 'pending',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists reviewed_at timestamptz;

-- Fail without modifying data if a legacy schema has not supplied mandatory ownership data.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.jobs WHERE employer_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.jobs WHERE title IS NULL OR description IS NULL OR country IS NULL OR job_type IS NULL)
    OR EXISTS (SELECT 1 FROM public.services WHERE seller_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.services WHERE title IS NULL OR description IS NULL OR category IS NULL OR base_price IS NULL)
    OR EXISTS (SELECT 1 FROM public.cvs WHERE user_id IS NULL OR file_path IS NULL)
    OR EXISTS (SELECT 1 FROM public.cvs WHERE split_part(file_path,'/',1)<>user_id::text)
    OR EXISTS (SELECT 1 FROM public.job_applications WHERE job_id IS NULL OR applicant_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.saved_jobs WHERE user_id IS NULL OR job_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.conversations WHERE user_one IS NULL OR user_two IS NULL)
    OR EXISTS (SELECT 1 FROM public.messages WHERE conversation_id IS NULL OR sender_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.reports WHERE reporter_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.verification_requests WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'Legacy required data or CV ownership paths need a reviewed mapping before beta hardening can continue; no rows were changed.';
  END IF;
END $$;

create index if not exists jobs_status_created_idx on public.jobs(status, created_at desc);
create index if not exists jobs_country_type_idx on public.jobs(country, job_type);
create index if not exists jobs_employer_idx on public.jobs(employer_id);
create index if not exists services_status_created_idx on public.services(status, created_at desc);
create index if not exists services_category_idx on public.services(category);
create index if not exists services_seller_idx on public.services(seller_id);
create index if not exists applications_job_idx on public.job_applications(job_id, created_at desc);
create index if not exists applications_user_idx on public.job_applications(applicant_id, created_at desc);
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);
create index if not exists messages_unread_idx on public.messages(conversation_id, is_read);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.jobs WHERE salary_min IS NOT NULL AND salary_max IS NOT NULL AND salary_max < salary_min) THEN
    RAISE EXCEPTION 'Existing jobs contain reversed salary ranges; review these rows before adding the beta salary constraint.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid='public.jobs'::regclass AND conname='jobs_salary_range_valid'
  ) THEN
    ALTER TABLE public.jobs ADD CONSTRAINT jobs_salary_range_valid
      CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_max >= salary_min) NOT VALID;
  END IF;
END $$;

ALTER TABLE public.jobs VALIDATE CONSTRAINT jobs_salary_range_valid;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='applications_job_applicant_unique') THEN
    IF EXISTS (SELECT 1 FROM public.job_applications GROUP BY job_id, applicant_id HAVING count(*) > 1) THEN
      RAISE EXCEPTION 'Duplicate job applications exist; review them before adding applications_job_applicant_unique.';
    END IF;
    CREATE UNIQUE INDEX applications_job_applicant_unique ON public.job_applications(job_id, applicant_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='conversations_pair_unique') THEN
    IF EXISTS (
      SELECT 1 FROM public.conversations
      GROUP BY least(user_one,user_two), greatest(user_one,user_two)
      HAVING count(*) > 1
    ) THEN
      RAISE EXCEPTION 'Duplicate conversations exist; review them before adding conversations_pair_unique.';
    END IF;
    CREATE UNIQUE INDEX conversations_pair_unique ON public.conversations (least(user_one,user_two), greatest(user_one,user_two));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='saved_jobs_user_job_unique') THEN
    IF EXISTS (SELECT 1 FROM public.saved_jobs GROUP BY user_id, job_id HAVING count(*) > 1) THEN
      RAISE EXCEPTION 'Duplicate saved jobs exist; review them before adding saved_jobs_user_job_unique.';
    END IF;
    CREATE UNIQUE INDEX saved_jobs_user_job_unique ON public.saved_jobs(user_id, job_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='cvs_file_path_unique') THEN
    IF EXISTS (SELECT 1 FROM public.cvs GROUP BY file_path HAVING count(*) > 1) THEN
      RAISE EXCEPTION 'Duplicate CV storage paths exist; review them before adding cvs_file_path_unique.';
    END IF;
    CREATE UNIQUE INDEX cvs_file_path_unique ON public.cvs(file_path);
  END IF;
END $$;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin' and not p.is_suspended); $$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
declare new_role text;
begin
  new_role := coalesce(new.raw_user_meta_data->>'role','job_seeker');
  if new_role not in ('job_seeker','freelancer','employer','client') then new_role := 'job_seeker'; end if;
  insert into public.profiles(id,display_name,role)
  values(new.id,nullif(new.raw_user_meta_data->>'display_name',''),new_role)
  on conflict (id) do nothing;
  return new;
end; $$;

create or replace function public.prevent_profile_privilege_escalation() returns trigger
language plpgsql security invoker set search_path = public
as $$
begin
  if auth.uid()=old.id and not public.is_admin() and (
    new.role is distinct from old.role or new.verified is distinct from old.verified or
    new.is_suspended is distinct from old.is_suspended
  ) then
    raise exception 'Profile privilege fields can only be changed by an admin';
  end if;
  return new;
end; $$;

create or replace function public.protect_message_updates() returns trigger
language plpgsql security invoker set search_path = public
as $$
begin
  if auth.uid() is null or old.sender_id=auth.uid() or old.is_read or not new.is_read or
    new.conversation_id is distinct from old.conversation_id or new.sender_id is distinct from old.sender_id or
    new.body is distinct from old.body or new.created_at is distinct from old.created_at then
    raise exception 'Messages can only be marked read by their recipient';
  end if;
  if not exists(select 1 from public.conversations c where c.id=old.conversation_id and auth.uid() in (c.user_one,c.user_two)) then
    raise exception 'Not a conversation participant';
  end if;
  new.read_at := coalesce(old.read_at,now());
  return new;
end; $$;

create or replace function public.protect_conversation_membership() returns trigger
language plpgsql security invoker set search_path = public
as $$
begin
  if new.user_one is distinct from old.user_one or new.user_two is distinct from old.user_two then
    raise exception 'Conversation participants cannot be changed';
  end if;
  return new;
end; $$;

create or replace function public.protect_application_identity() returns trigger
language plpgsql security invoker set search_path = public
as $$
begin
  if new.job_id is distinct from old.job_id or new.applicant_id is distinct from old.applicant_id or
    new.cv_id is distinct from old.cv_id or new.cover_letter is distinct from old.cover_letter or
    new.created_at is distinct from old.created_at then
    raise exception 'Application details cannot be changed after submission';
  end if;
  return new;
end; $$;

DO $$
DECLARE policy_row record;
BEGIN
  FOR policy_row IN
    SELECT tablename, policyname FROM (VALUES
      ('profiles','profiles public read'),('profiles','profiles own insert'),('profiles','profiles own update'),('profiles','profiles admin delete'),
      ('jobs','jobs public read active'),('jobs','jobs employer insert'),('jobs','jobs employer update'),('jobs','jobs employer delete'),
      ('services','services public read active'),('services','services seller insert'),('services','services seller update'),('services','services seller delete'),
      ('cvs','cvs owner or hiring employer read'),('cvs','cvs owner insert'),('cvs','cvs owner update'),('cvs','cvs owner delete'),
      ('job_applications','applications applicant or employer read'),('job_applications','applications applicant insert'),('job_applications','applications employer update'),
      ('saved_jobs','saved jobs own read'),('saved_jobs','saved jobs own insert'),('saved_jobs','saved jobs own delete'),
      ('conversations','conversations participants read'),('conversations','conversations participants insert'),('conversations','conversations participants update'),('conversations','conversations participant delete'),
      ('messages','messages participants read'),('messages','messages participant insert'),('messages','messages recipients update read state'),
      ('reports','reports own or admin read'),('reports','reports authenticated insert'),('reports','reports admin update'),
      ('verification_requests','verification own or admin read'),('verification_requests','verification own insert'),('verification_requests','verification admin update'),
      ('profiles','profiles beta guard select'),('profiles','profiles beta guard insert'),('profiles','profiles beta guard update'),('profiles','profiles beta guard delete'),
      ('jobs','jobs beta guard select'),('jobs','jobs beta guard insert'),('jobs','jobs beta guard update'),('jobs','jobs beta guard delete'),
      ('services','services beta guard select'),('services','services beta guard insert'),('services','services beta guard update'),('services','services beta guard delete'),
      ('cvs','cvs beta guard select'),('cvs','cvs beta guard insert'),('cvs','cvs beta guard update'),('cvs','cvs beta guard delete'),
      ('job_applications','applications beta guard select'),('job_applications','applications beta guard insert'),('job_applications','applications beta guard update'),('job_applications','applications beta guard delete'),
      ('saved_jobs','saved jobs beta guard select'),('saved_jobs','saved jobs beta guard insert'),('saved_jobs','saved jobs beta guard delete'),
      ('conversations','conversations beta guard select'),('conversations','conversations beta guard insert'),('conversations','conversations beta guard update'),('conversations','conversations beta guard delete'),
      ('messages','messages beta guard select'),('messages','messages beta guard insert'),('messages','messages beta guard update'),('messages','messages beta guard delete'),
      ('reports','reports beta guard select'),('reports','reports beta guard insert'),('reports','reports beta guard update'),('reports','reports beta guard delete'),
      ('verification_requests','verification beta guard select'),('verification_requests','verification beta guard insert'),('verification_requests','verification beta guard update'),('verification_requests','verification beta guard delete')
    ) AS expected(tablename,policyname)
  LOOP
    EXECUTE format('drop policy if exists %I on public.%I', policy_row.policyname, policy_row.tablename);
  END LOOP;
END $$;

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.services enable row level security;
alter table public.cvs enable row level security;
alter table public.job_applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.verification_requests enable row level security;

create policy "profiles public read" on public.profiles for select using (not is_suspended or id=auth.uid() or public.is_admin());
create policy "profiles own insert" on public.profiles for insert with check (id=auth.uid() and role<>'admin' and not verified and not is_suspended);
create policy "profiles own update" on public.profiles for update using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());
create policy "profiles admin delete" on public.profiles for delete using (public.is_admin());

create policy "jobs public read active" on public.jobs for select using (status='active' or employer_id=auth.uid() or public.is_admin());
create policy "jobs employer insert" on public.jobs for insert with check (employer_id=auth.uid() and (public.is_admin() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='employer' and not p.is_suspended)));
create policy "jobs employer update" on public.jobs for update using (employer_id=auth.uid() or public.is_admin()) with check (employer_id=auth.uid() or public.is_admin());
create policy "jobs employer delete" on public.jobs for delete using (employer_id=auth.uid() or public.is_admin());

create policy "services public read active" on public.services for select using (status='active' or seller_id=auth.uid() or public.is_admin());
create policy "services seller insert" on public.services for insert with check (seller_id=auth.uid() and (public.is_admin() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='freelancer' and not p.is_suspended)));
create policy "services seller update" on public.services for update using (seller_id=auth.uid() or public.is_admin()) with check (seller_id=auth.uid() or public.is_admin());
create policy "services seller delete" on public.services for delete using (seller_id=auth.uid() or public.is_admin());

create policy "cvs owner or hiring employer read" on public.cvs for select using (
  user_id=auth.uid() or public.is_admin() or exists(
    select 1 from public.job_applications a join public.jobs j on j.id=a.job_id
    where a.cv_id=cvs.id and a.applicant_id=cvs.user_id and j.employer_id=auth.uid()
  )
);
create policy "cvs owner insert" on public.cvs for insert with check (user_id=auth.uid() and split_part(file_path,'/',1)=user_id::text);
create policy "cvs owner update" on public.cvs for update using (user_id=auth.uid()) with check (user_id=auth.uid() and split_part(file_path,'/',1)=user_id::text);
create policy "cvs owner delete" on public.cvs for delete using (user_id=auth.uid());

create policy "applications applicant or employer read" on public.job_applications for select using (
  applicant_id=auth.uid() or public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
);
create policy "applications applicant insert" on public.job_applications for insert with check (
  applicant_id=auth.uid() and exists(select 1 from public.jobs j where j.id=job_id and j.status='active' and j.employer_id<>auth.uid()) and
  (cv_id is null or exists(select 1 from public.cvs c where c.id=cv_id and c.user_id=auth.uid()))
);
create policy "applications employer update" on public.job_applications for update using (
  public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
) with check (public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid()));

create policy "saved jobs own read" on public.saved_jobs for select using (user_id=auth.uid());
create policy "saved jobs own insert" on public.saved_jobs for insert with check (user_id=auth.uid());
create policy "saved jobs own delete" on public.saved_jobs for delete using (user_id=auth.uid());

create policy "conversations participants read" on public.conversations for select using (auth.uid() in (user_one,user_two));
create policy "conversations participants insert" on public.conversations for insert with check (auth.uid() in (user_one,user_two));
create policy "conversations participants update" on public.conversations for update using (auth.uid() in (user_one,user_two)) with check (auth.uid() in (user_one,user_two));
create policy "conversations participant delete" on public.conversations for delete using (auth.uid() in (user_one,user_two));

create policy "messages participants read" on public.messages for select using (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages participant insert" on public.messages for insert with check (sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages recipients update read state" on public.messages for update using (sender_id<>auth.uid() and not is_read and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two))) with check (sender_id<>auth.uid() and is_read and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));

create policy "reports own or admin read" on public.reports for select using (reporter_id=auth.uid() or public.is_admin());
create policy "reports authenticated insert" on public.reports for insert with check (reporter_id=auth.uid());
create policy "reports admin update" on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "verification own or admin read" on public.verification_requests for select using (user_id=auth.uid() or public.is_admin());
create policy "verification own insert" on public.verification_requests for insert with check (user_id=auth.uid());
create policy "verification admin update" on public.verification_requests for update using (public.is_admin()) with check (public.is_admin());

-- Restrictive policies fence access even when unrelated legacy permissive policies remain.
create policy "profiles beta guard select" on public.profiles as restrictive for select to public using (not is_suspended or id=auth.uid() or public.is_admin());
create policy "profiles beta guard insert" on public.profiles as restrictive for insert to public with check (id=auth.uid() and role<>'admin' and not verified and not is_suspended);
create policy "profiles beta guard update" on public.profiles as restrictive for update to public using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());
create policy "profiles beta guard delete" on public.profiles as restrictive for delete to public using (public.is_admin());

create policy "jobs beta guard select" on public.jobs as restrictive for select to public using (status='active' or employer_id=auth.uid() or public.is_admin());
create policy "jobs beta guard insert" on public.jobs as restrictive for insert to public with check (employer_id=auth.uid() and (public.is_admin() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='employer' and not p.is_suspended)));
create policy "jobs beta guard update" on public.jobs as restrictive for update to public using (employer_id=auth.uid() or public.is_admin()) with check (employer_id=auth.uid() or public.is_admin());
create policy "jobs beta guard delete" on public.jobs as restrictive for delete to public using (employer_id=auth.uid() or public.is_admin());

create policy "services beta guard select" on public.services as restrictive for select to public using (status='active' or seller_id=auth.uid() or public.is_admin());
create policy "services beta guard insert" on public.services as restrictive for insert to public with check (seller_id=auth.uid() and (public.is_admin() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='freelancer' and not p.is_suspended)));
create policy "services beta guard update" on public.services as restrictive for update to public using (seller_id=auth.uid() or public.is_admin()) with check (seller_id=auth.uid() or public.is_admin());
create policy "services beta guard delete" on public.services as restrictive for delete to public using (seller_id=auth.uid() or public.is_admin());

create policy "cvs beta guard select" on public.cvs as restrictive for select to public using (
  user_id=auth.uid() or public.is_admin() or exists(select 1 from public.job_applications a join public.jobs j on j.id=a.job_id where a.cv_id=cvs.id and a.applicant_id=cvs.user_id and j.employer_id=auth.uid())
);
create policy "cvs beta guard insert" on public.cvs as restrictive for insert to public with check (user_id=auth.uid() and split_part(file_path,'/',1)=user_id::text);
create policy "cvs beta guard update" on public.cvs as restrictive for update to public using (user_id=auth.uid()) with check (user_id=auth.uid() and split_part(file_path,'/',1)=user_id::text);
create policy "cvs beta guard delete" on public.cvs as restrictive for delete to public using (user_id=auth.uid());

create policy "applications beta guard select" on public.job_applications as restrictive for select to public using (
  applicant_id=auth.uid() or public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
);
create policy "applications beta guard insert" on public.job_applications as restrictive for insert to public with check (
  applicant_id=auth.uid() and exists(select 1 from public.jobs j where j.id=job_id and j.status='active' and j.employer_id<>auth.uid()) and
  (cv_id is null or exists(select 1 from public.cvs c where c.id=cv_id and c.user_id=auth.uid()))
);
create policy "applications beta guard update" on public.job_applications as restrictive for update to public using (
  public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
) with check (public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid()));
create policy "applications beta guard delete" on public.job_applications as restrictive for delete to public using (false);

create policy "saved jobs beta guard select" on public.saved_jobs as restrictive for select to public using (user_id=auth.uid());
create policy "saved jobs beta guard insert" on public.saved_jobs as restrictive for insert to public with check (user_id=auth.uid());
create policy "saved jobs beta guard delete" on public.saved_jobs as restrictive for delete to public using (user_id=auth.uid());

create policy "conversations beta guard select" on public.conversations as restrictive for select to public using (auth.uid() in (user_one,user_two));
create policy "conversations beta guard insert" on public.conversations as restrictive for insert to public with check (auth.uid() in (user_one,user_two) and user_one<>user_two);
create policy "conversations beta guard update" on public.conversations as restrictive for update to public using (auth.uid() in (user_one,user_two)) with check (auth.uid() in (user_one,user_two));
create policy "conversations beta guard delete" on public.conversations as restrictive for delete to public using (auth.uid() in (user_one,user_two));

create policy "messages beta guard select" on public.messages as restrictive for select to public using (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages beta guard insert" on public.messages as restrictive for insert to public with check (sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages beta guard update" on public.messages as restrictive for update to public using (sender_id<>auth.uid() and not is_read and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two))) with check (sender_id<>auth.uid() and is_read and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages beta guard delete" on public.messages as restrictive for delete to public using (false);

create policy "reports beta guard select" on public.reports as restrictive for select to public using (reporter_id=auth.uid() or public.is_admin());
create policy "reports beta guard insert" on public.reports as restrictive for insert to public with check (reporter_id=auth.uid());
create policy "reports beta guard update" on public.reports as restrictive for update to public using (public.is_admin()) with check (public.is_admin());
create policy "reports beta guard delete" on public.reports as restrictive for delete to public using (public.is_admin());
create policy "verification beta guard select" on public.verification_requests as restrictive for select to public using (user_id=auth.uid() or public.is_admin());
create policy "verification beta guard insert" on public.verification_requests as restrictive for insert to public with check (user_id=auth.uid());
create policy "verification beta guard update" on public.verification_requests as restrictive for update to public using (public.is_admin()) with check (public.is_admin());
create policy "verification beta guard delete" on public.verification_requests as restrictive for delete to public using (public.is_admin());

-- Attach only the hardening triggers; drops are limited to same-named triggers.
DO $$ BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE 'drop trigger if exists profiles_updated_at on public.profiles';
    EXECUTE 'create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at()';
    EXECUTE 'drop trigger if exists profiles_protect_privileges on public.profiles';
    EXECUTE 'create trigger profiles_protect_privileges before update on public.profiles for each row execute function public.prevent_profile_privilege_escalation()';
  END IF;
  EXECUTE 'drop trigger if exists jobs_updated_at on public.jobs';
  EXECUTE 'create trigger jobs_updated_at before update on public.jobs for each row execute function public.set_updated_at()';
  EXECUTE 'drop trigger if exists services_updated_at on public.services';
  EXECUTE 'create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at()';
  EXECUTE 'drop trigger if exists applications_updated_at on public.job_applications';
  EXECUTE 'create trigger applications_updated_at before update on public.job_applications for each row execute function public.set_updated_at()';
  EXECUTE 'drop trigger if exists applications_protect_identity on public.job_applications';
  EXECUTE 'create trigger applications_protect_identity before update on public.job_applications for each row execute function public.protect_application_identity()';
  EXECUTE 'drop trigger if exists messages_protect_updates on public.messages';
  EXECUTE 'create trigger messages_protect_updates before update on public.messages for each row execute function public.protect_message_updates()';
  EXECUTE 'drop trigger if exists conversations_protect_membership on public.conversations';
  EXECUTE 'create trigger conversations_protect_membership before update on public.conversations for each row execute function public.protect_conversation_membership()';
  EXECUTE 'drop trigger if exists reports_updated_at on public.reports';
  EXECUTE 'create trigger reports_updated_at before update on public.reports for each row execute function public.set_updated_at()';
END $$;

-- The auth trigger is replaced only by name; existing auth users and profiles are preserved.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Make the CV bucket private and replace policies specifically scoped to CV objects.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('cvs','cvs',false,5242880,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

DO $$
BEGIN
  DROP POLICY IF EXISTS "cv storage upload own folder" ON storage.objects;
  DROP POLICY IF EXISTS "cv storage owner or hiring employer read" ON storage.objects;
  DROP POLICY IF EXISTS "cv storage owner delete" ON storage.objects;
  DROP POLICY IF EXISTS "cv bucket restrictive read" ON storage.objects;
  DROP POLICY IF EXISTS "cv bucket restrictive upload" ON storage.objects;
  DROP POLICY IF EXISTS "cv bucket restrictive update" ON storage.objects;
  DROP POLICY IF EXISTS "cv bucket restrictive delete" ON storage.objects;
END $$;

create policy "cv storage upload own folder" on storage.objects for insert to authenticated
with check (bucket_id='cvs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "cv storage owner or hiring employer read" on storage.objects for select to authenticated using (
  bucket_id='cvs' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin() or exists(
    select 1 from public.cvs c join public.job_applications a on a.cv_id=c.id join public.jobs j on j.id=a.job_id
    where c.file_path=name and c.user_id=a.applicant_id and (storage.foldername(name))[1]=a.applicant_id::text and j.employer_id=auth.uid()
  ))
);
create policy "cv storage owner delete" on storage.objects for delete to authenticated
using (bucket_id='cvs' and (storage.foldername(name))[1]=auth.uid()::text);

-- Restrictive guards remain effective even if a legacy broad permissive policy exists.
create policy "cv bucket restrictive read" on storage.objects as restrictive for select to public using (
  bucket_id<>'cvs' or (auth.uid() is not null and (
    (storage.foldername(name))[1]=auth.uid()::text or public.is_admin() or exists(
      select 1 from public.cvs c join public.job_applications a on a.cv_id=c.id join public.jobs j on j.id=a.job_id
      where c.file_path=name and c.user_id=a.applicant_id and (storage.foldername(name))[1]=a.applicant_id::text and j.employer_id=auth.uid()
    )
  ))
);
create policy "cv bucket restrictive upload" on storage.objects as restrictive for insert to public with check (
  bucket_id<>'cvs' or (auth.uid() is not null and (storage.foldername(name))[1]=auth.uid()::text)
);
create policy "cv bucket restrictive update" on storage.objects as restrictive for update to public
using (bucket_id<>'cvs' or (auth.uid() is not null and (storage.foldername(name))[1]=auth.uid()::text))
with check (bucket_id<>'cvs' or (auth.uid() is not null and (storage.foldername(name))[1]=auth.uid()::text));
create policy "cv bucket restrictive delete" on storage.objects as restrictive for delete to public using (
  bucket_id<>'cvs' or (auth.uid() is not null and (storage.foldername(name))[1]=auth.uid()::text)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

commit;
