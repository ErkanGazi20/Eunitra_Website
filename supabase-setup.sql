-- EUNITRA website: secure homepage statistics
-- Run this in Supabase SQL Editor once for the project.

create table if not exists public.site_stats (
  id smallint primary key default 1 check (id = 1),
  projects integer not null check (projects >= 0),
  success integer not null check (success between 0 and 100),
  markets integer not null check (markets >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_stats (id, projects, success, markets)
values (1, 24, 91, 6)
on conflict (id) do nothing;

alter table public.site_stats enable row level security;

-- Explicit grants: public visitors may only read; authenticated users may read/update.
revoke all on table public.site_stats from anon, authenticated;
grant select on table public.site_stats to anon, authenticated;
grant update on table public.site_stats to authenticated;

-- Re-runnable policy setup.
drop policy if exists "Public can read homepage statistics" on public.site_stats;
drop policy if exists "EUNITRA admin can update homepage statistics" on public.site_stats;

create policy "Public can read homepage statistics"
on public.site_stats
for select
to anon, authenticated
using (true);

create policy "EUNITRA admin can update homepage statistics"
on public.site_stats
for update
to authenticated
using (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ulku@eunitra.com'
)
with check (
  id = 1
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ulku@eunitra.com'
);
