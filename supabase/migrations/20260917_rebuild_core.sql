-- GulfFreelance reconstructed MVP schema
-- Apply in a fresh Supabase project using SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  country text,
  city text,
  preferred_language text not null default 'en' check (preferred_language in ('en','ar')),
  role text not null default 'job_seeker' check (role in ('job_seeker','freelancer','employer','client','admin')),
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
  job_type text not null check (job_type in ('full_time','part_time','contract','temporary','internship')),
  salary_min numeric,
  salary_max numeric,
  currency text not null default 'AED',
  remote boolean not null default false,
  status text not null default 'active' check (status in ('draft','active','paused','closed','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  base_price numeric not null check (base_price >= 0),
  currency text not null default 'AED',
  delivery_days integer not null check (delivery_days between 1 and 90),
  status text not null default 'active' check (status in ('draft','active','paused','removed')),
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
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 5242880),
  created_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  cv_id uuid references public.cvs(id) on delete set null,
  cover_letter text not null default '',
  status text not null default 'submitted' check (status in ('submitted','reviewing','shortlisted','rejected','hired','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, applicant_id)
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
  updated_at timestamptz not null default now(),
  check (user_one <> user_two)
);
create unique index if not exists conversations_pair_unique on public.conversations (least(user_one,user_two), greatest(user_one,user_two));

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('user','job','service','message')),
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'profile',
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

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

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at before update on public.jobs for each row execute function public.set_updated_at();
drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();
drop trigger if exists applications_updated_at on public.job_applications;
create trigger applications_updated_at before update on public.job_applications for each row execute function public.set_updated_at();
drop trigger if exists reports_updated_at on public.reports;
create trigger reports_updated_at before update on public.reports for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
declare new_role text;
begin
  new_role := coalesce(new.raw_user_meta_data->>'role','job_seeker');
  if new_role not in ('job_seeker','freelancer','employer','client') then new_role := 'job_seeker'; end if;
  insert into public.profiles(id, display_name, role)
  values(new.id, nullif(new.raw_user_meta_data->>'display_name',''), new_role)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin' and not p.is_suspended); $$;

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

-- Profiles
create policy "profiles public read" on public.profiles for select using (not is_suspended or id = auth.uid() or public.is_admin());
create policy "profiles own insert" on public.profiles for insert with check (id = auth.uid());
create policy "profiles own update" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- Jobs
create policy "jobs public read active" on public.jobs for select using (status='active' or employer_id=auth.uid() or public.is_admin());
create policy "jobs employer insert" on public.jobs for insert with check (employer_id=auth.uid() and not exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_suspended));
create policy "jobs employer update" on public.jobs for update using (employer_id=auth.uid() or public.is_admin()) with check (employer_id=auth.uid() or public.is_admin());
create policy "jobs employer delete" on public.jobs for delete using (employer_id=auth.uid() or public.is_admin());

-- Services
create policy "services public read active" on public.services for select using (status='active' or seller_id=auth.uid() or public.is_admin());
create policy "services seller insert" on public.services for insert with check (seller_id=auth.uid());
create policy "services seller update" on public.services for update using (seller_id=auth.uid() or public.is_admin()) with check (seller_id=auth.uid() or public.is_admin());
create policy "services seller delete" on public.services for delete using (seller_id=auth.uid() or public.is_admin());

-- CVs
create policy "cvs owner or hiring employer read" on public.cvs for select using (
  user_id=auth.uid() or public.is_admin() or exists(
    select 1 from public.job_applications a join public.jobs j on j.id=a.job_id
    where a.cv_id=cvs.id and j.employer_id=auth.uid()
  )
);
create policy "cvs owner insert" on public.cvs for insert with check (user_id=auth.uid());
create policy "cvs owner update" on public.cvs for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "cvs owner delete" on public.cvs for delete using (user_id=auth.uid());

-- Applications
create policy "applications applicant or employer read" on public.job_applications for select using (
  applicant_id=auth.uid() or public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
);
create policy "applications applicant insert" on public.job_applications for insert with check (
  applicant_id=auth.uid() and (cv_id is null or exists(select 1 from public.cvs c where c.id=cv_id and c.user_id=auth.uid()))
);
create policy "applications employer or applicant update" on public.job_applications for update using (
  applicant_id=auth.uid() or public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
) with check (
  applicant_id=auth.uid() or public.is_admin() or exists(select 1 from public.jobs j where j.id=job_id and j.employer_id=auth.uid())
);

-- Saved jobs
create policy "saved jobs own read" on public.saved_jobs for select using (user_id=auth.uid());
create policy "saved jobs own insert" on public.saved_jobs for insert with check (user_id=auth.uid());
create policy "saved jobs own delete" on public.saved_jobs for delete using (user_id=auth.uid());

-- Conversations
create policy "conversations participants read" on public.conversations for select using (auth.uid() in (user_one,user_two));
create policy "conversations participants insert" on public.conversations for insert with check (auth.uid() in (user_one,user_two));
create policy "conversations participants update" on public.conversations for update using (auth.uid() in (user_one,user_two)) with check (auth.uid() in (user_one,user_two));

-- Messages
create policy "messages participants read" on public.messages for select using (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages participant insert" on public.messages for insert with check (sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));
create policy "messages participants update read state" on public.messages for update using (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two))) with check (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid() in (c.user_one,c.user_two)));

-- Moderation
create policy "reports own or admin read" on public.reports for select using (reporter_id=auth.uid() or public.is_admin());
create policy "reports authenticated insert" on public.reports for insert with check (reporter_id=auth.uid());
create policy "reports admin update" on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "verification own or admin read" on public.verification_requests for select using (user_id=auth.uid() or public.is_admin());
create policy "verification own insert" on public.verification_requests for insert with check (user_id=auth.uid());
create policy "verification admin update" on public.verification_requests for update using (public.is_admin()) with check (public.is_admin());

-- Private CV storage
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('cvs','cvs',false,5242880,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

create policy "cv storage upload own folder" on storage.objects for insert to authenticated
with check (bucket_id='cvs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "cv storage owner or hiring employer read" on storage.objects for select to authenticated
using (
  bucket_id='cvs' and (
    (storage.foldername(name))[1]=auth.uid()::text or public.is_admin() or exists(
      select 1 from public.cvs c
      join public.job_applications a on a.cv_id=c.id
      join public.jobs j on j.id=a.job_id
      where c.file_path=name and j.employer_id=auth.uid()
    )
  )
);
create policy "cv storage owner delete" on storage.objects for delete to authenticated
using (bucket_id='cvs' and (storage.foldername(name))[1]=auth.uid()::text);

-- Realtime messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;
