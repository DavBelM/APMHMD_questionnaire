-- Run this in the Supabase SQL editor if the `responses` table already
-- exists (i.e. you ran the original schema.sql before this change).
--
-- Adds the travel-time-to-clinic field introduced after pilot testing
-- (see docs/Testing and Validating Criteria and Results.pdf).

alter table public.responses
  add column if not exists travel_time_health_center text;

-- Backfill any existing rows so the not-null constraint can be applied.
update public.responses
  set travel_time_health_center = 'Not recorded'
  where travel_time_health_center is null;

alter table public.responses
  alter column travel_time_health_center set not null;
