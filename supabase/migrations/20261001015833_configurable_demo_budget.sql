-- Application budget, independent from organization/model Groq rate limits.
-- One owner-managed configuration; no secret or client-selected allowance.
create table public.agentnexos_demo_limits (
  singleton boolean primary key default true check (singleton),
  connection_daily_limit integer not null check (connection_daily_limit between 1 and 1000000),
  global_daily_limit integer not null check (global_daily_limit between connection_daily_limit and 1000000)
);
alter table public.agentnexos_demo_limits enable row level security;
revoke all on public.agentnexos_demo_limits from public, anon, authenticated, service_role;
grant select on public.agentnexos_demo_limits to service_role;
insert into public.agentnexos_demo_limits(singleton, connection_daily_limit, global_daily_limit) values(true, 1000, 10000);

create function public.reserve_agentnexos_demo_v3(p_subject_hash text) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare request_id uuid; first_at timestamptz; active_at timestamptz; retry_seconds integer; limits public.agentnexos_demo_limits%rowtype;
begin
  if p_subject_hash !~ '^[a-f0-9]{64}$' or p_subject_hash is null then raise exception 'Invalid subject'; end if;
  perform pg_catalog.pg_advisory_xact_lock(20260930, 3);
  select * into strict limits from public.agentnexos_demo_limits where singleton = true;
  delete from public.agentnexos_demo_requests where created_at < now() - interval '48 hours';
  -- An abandoned reservation expires after the existing 180-second API lifetime.
  select min(created_at) into active_at from public.agentnexos_demo_requests
    where subject_hash = p_subject_hash and status in ('reserved', 'running') and created_at > now() - interval '180 seconds';
  if active_at is not null then
    retry_seconds := greatest(1, ceil(extract(epoch from active_at + interval '180 seconds' - now()))::integer);
    return jsonb_build_object('code', 'DEMO_BUSY', 'retryAfterSeconds', retry_seconds);
  end if;
  if (select count(*) from public.agentnexos_demo_requests where subject_hash = p_subject_hash and created_at > now() - interval '24 hours') >= limits.connection_daily_limit then
    select min(created_at) into first_at from public.agentnexos_demo_requests where subject_hash = p_subject_hash and created_at > now() - interval '24 hours';
    retry_seconds := greatest(1, ceil(extract(epoch from first_at + interval '24 hours' - now()))::integer);
    return jsonb_build_object('code', 'DEMO_DAILY_LIMIT', 'retryAfterSeconds', retry_seconds, 'limit', limits.connection_daily_limit, 'windowSeconds', 86400);
  end if;
  if (select count(*) from public.agentnexos_demo_requests where created_at > now() - interval '24 hours') >= limits.global_daily_limit then
    select min(created_at) into first_at from public.agentnexos_demo_requests where created_at > now() - interval '24 hours';
    retry_seconds := greatest(1, ceil(extract(epoch from first_at + interval '24 hours' - now()))::integer);
    return jsonb_build_object('code', 'DEMO_GLOBAL_LIMIT', 'retryAfterSeconds', retry_seconds, 'limit', limits.global_daily_limit, 'windowSeconds', 86400);
  end if;
  insert into public.agentnexos_demo_requests(subject_hash) values(p_subject_hash) returning id into request_id;
  return jsonb_build_object('code', 'RESERVED', 'runId', request_id);
end;
$$;
revoke all on function public.reserve_agentnexos_demo_v3(text) from public, anon, authenticated;
grant execute on function public.reserve_agentnexos_demo_v3(text) to service_role;

-- Preserve old API response schemas during rollout/rollback.
create or replace function public.reserve_agentnexos_demo_v2(p_subject_hash text) returns jsonb
language sql security invoker set search_path = '' as $$
  select public.reserve_agentnexos_demo_v3(p_subject_hash) - 'limit' - 'windowSeconds';
$$;
revoke all on function public.reserve_agentnexos_demo_v2(text) from public, anon, authenticated;
grant execute on function public.reserve_agentnexos_demo_v2(text) to service_role;
-- The existing UUID reserve_agentnexos_demo wrapper still delegates to v2.
