-- supabase-js v2 sends Prefer: return=representation after every insert,
-- triggering a SELECT on the inserted row. Without a SELECT policy for the
-- anon role, PostgREST raises "new row violates row-level security policy"
-- even though the insert itself succeeded.
--
-- This policy satisfies PostgREST's post-insert read while exposing
-- zero rows to anonymous users (USING false → no rows ever match).

create policy "Allow anon post-insert select"
  on public.responses
  for select
  to anon
  using (false);
