-- Run this in the Supabase SQL editor for your project.

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Section A: Demographic Information
  age text not null,
  education text not null,
  occupation text not null,
  district text not null,
  pregnancy_months text not null,

  -- Section B: Maternal Healthcare Access
  anc_attended text not null,
  anc_visits text,
  distance_health_center text not null,
  travel_time_health_center text not null,

  -- Section C: Technology Awareness
  owns_phone text not null,
  heard_wearable text not null,
  willing_to_use text not null,
  barriers text[] not null default '{}',
  barrier_other text,

  -- Section D: Preparedness
  prevent_complications text not null,
  allow_chw_alerts text not null,
  additional_comments text
);

alter table public.responses enable row level security;

-- Grant table-level privileges (required alongside RLS policies).
grant insert on public.responses to anon;
grant select on public.responses to authenticated;

-- Anyone (anon key) can submit a response.
create policy "Allow anonymous insert"
  on public.responses
  for insert
  to anon
  with check (true);

-- Only authenticated (admin) users can read responses.
create policy "Allow authenticated read"
  on public.responses
  for select
  to authenticated
  using (true);

-- Allows supabase-js post-insert read to complete without error,
-- while exposing zero rows to anonymous users.
create policy "Allow anon post-insert select"
  on public.responses
  for select
  to anon
  using (false);

-- To create an admin login: in Supabase Dashboard -> Authentication -> Users,
-- add a user manually with an email/password. Use those credentials to log
-- into the /admin page of this app.
