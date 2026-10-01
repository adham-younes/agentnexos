-- Compatible rollout: old deployments call the UUID wrapper; new ones get reasons.
-- Keep the existing 5/subject and 100/global rolling-day budget and RLS/grants.
create function public.reserve_agentnexos_demo_v2(p_subject_hash text) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare request_id uuid; first_at timestamptz; active_at timestamptz; retry_seconds integer;
begin
  if p_subject_hash !~ '^[a-f0-9]{64}$' or p_subject_hash is null then raise exception 'Invalid subject'; end if;
  perform pg_catalog.pg_advisory_xact_lock(20260930, 3);
  delete from public.agentnexos_demo_requests where created_at < now() - interval '48 hours';
  -- An abandoned reservation expires after the existing 180-second API lifetime.
  select min(created_at) into active_at from public.agentnexos_demo_requests
    where subject_hash = p_subject_hash and status in ('reserved', 'running') and created_at > now() - interval '180 seconds';
  if active_at is not null then
    retry_seconds := greatest(1, ceil(extract(epoch from active_at + interval '180 seconds' - now()))::integer);
    return jsonb_build_object('code', 'DEMO_BUSY', 'retryAfterSeconds', retry_seconds);
  end if;
  if (select count(*) from public.agentnexos_demo_requests where subject_hash = p_subject_hash and created_at > now() - interval '24 hours') >= 5 then
    select min(created_at) into first_at from public.agentnexos_demo_requests where subject_hash = p_subject_hash and created_at > now() - interval '24 hours';
    retry_seconds := greatest(1, ceil(extract(epoch from first_at + interval '24 hours' - now()))::integer);
    return jsonb_build_object('code', 'DEMO_DAILY_LIMIT', 'retryAfterSeconds', retry_seconds);
  end if;
  if (select count(*) from public.agentnexos_demo_requests where created_at > now() - interval '24 hours') >= 100 then
    select min(created_at) into first_at from public.agentnexos_demo_requests where created_at > now() - interval '24 hours';
    retry_seconds := greatest(1, ceil(extract(epoch from first_at + interval '24 hours' - now()))::integer);
    return jsonb_build_object('code', 'DEMO_GLOBAL_LIMIT', 'retryAfterSeconds', retry_seconds);
  end if;
  insert into public.agentnexos_demo_requests(subject_hash) values(p_subject_hash) returning id into request_id;
  return jsonb_build_object('code', 'RESERVED', 'runId', request_id);
end;
$$;
revoke all on function public.reserve_agentnexos_demo_v2(text) from public, anon, authenticated;
grant execute on function public.reserve_agentnexos_demo_v2(text) to service_role;

create or replace function public.reserve_agentnexos_demo(p_subject_hash text) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare reservation jsonb;
begin
  reservation := public.reserve_agentnexos_demo_v2(p_subject_hash);
  if reservation->>'code' = 'RESERVED' then return (reservation->>'runId')::uuid; end if;
  return null;
end;
$$;
revoke all on function public.reserve_agentnexos_demo(text) from public, anon, authenticated;
grant execute on function public.reserve_agentnexos_demo(text) to service_role;
