-- Fixes "new row violates row-level security policy" on insert.
-- RLS policies alone are not enough — the role must also have
-- table-level privileges granted explicitly.

grant insert on public.responses to anon;
grant select on public.responses to authenticated;
