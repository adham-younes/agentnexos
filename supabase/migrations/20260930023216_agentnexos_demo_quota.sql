-- Standalone public read-only demo budget. No enterprise conversation data.
-- Apply only to the verified Agentnexos project; never to another account's DB.
create table public.agentnexos_demo_requests (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (length(subject_hash) = 64),
  created_at timestamptz not null default now(),
  status text not null default 'reserved' check (status in ('reserved','running','completed','failed','cancelled')),
  stages jsonb not null default '[]'::jsonb,
  completed_at timestamptz
);
create index agentnexos_demo_time_idx on public.agentnexos_demo_requests (created_at);
create index agentnexos_demo_subject_idx on public.agentnexos_demo_requests (subject_hash, created_at);
alter table public.agentnexos_demo_requests enable row level security;
revoke all on public.agentnexos_demo_requests from anon, authenticated;
grant select, insert, update, delete on public.agentnexos_demo_requests to service_role;

create function public.agentnexos_demo_ready() returns boolean
language sql security invoker set search_path = '' as $$
  select exists(select 1 from pg_catalog.pg_class where oid = 'public.agentnexos_demo_requests'::regclass);
$$;
revoke all on function public.agentnexos_demo_ready() from public, anon, authenticated;
grant execute on function public.agentnexos_demo_ready() to service_role;

create function public.reserve_agentnexos_demo(p_subject_hash text) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare request_id uuid;
begin
  if p_subject_hash !~ '^[a-f0-9]{64}$' then raise exception 'Invalid subject'; end if;
  -- Global lock serializes reservation across all serverless instances.
  perform pg_catalog.pg_advisory_xact_lock(20260930, 3);
  delete from public.agentnexos_demo_requests where created_at < now() - interval '48 hours';
  if (select count(*) from public.agentnexos_demo_requests where created_at > now() - interval '24 hours') >= 100 then return null; end if;
  if (select count(*) from public.agentnexos_demo_requests where subject_hash = p_subject_hash and created_at > now() - interval '24 hours') >= 5 then return null; end if;
  if exists(select 1 from public.agentnexos_demo_requests where subject_hash = p_subject_hash and created_at > now() - interval '30 seconds') then return null; end if;
  insert into public.agentnexos_demo_requests(subject_hash) values(p_subject_hash) returning id into request_id;
  return request_id;
end;
$$;
revoke all on function public.reserve_agentnexos_demo(text) from public, anon, authenticated;
grant execute on function public.reserve_agentnexos_demo(text) to service_role;
