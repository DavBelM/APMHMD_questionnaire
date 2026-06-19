-- Enumerators use the survey form on a tablet where they are also
-- logged into the admin dashboard. The Supabase client sends their
-- authenticated session with every request, including survey submissions.
-- Without this policy, authenticated users (admins/enumerators) cannot
-- insert responses — only anon users can.

create policy "Allow authenticated insert"
  on public.responses
  for insert
  to authenticated
  with check (true);
