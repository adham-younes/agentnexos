create extension if not exists pgcrypto;
create schema if not exists private;

create type public.member_role as enum ('owner','admin','operator','viewer');
create type public.run_status as enum ('created','planned','running','awaiting_approval','completed','failed','cancelled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  owner_id uuid not null references auth.users(id) on delete restrict,
  region text not null default 'eu-west-1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (organization_id,user_id)
);
create table public.workflow_blueprints (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, description text not null default '', version integer not null default 1 check(version>0),
  contract jsonb not null default '{}'::jsonb, created_by uuid not null references auth.users(id), created_at timestamptz not null default now()
);
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  blueprint_id uuid references public.workflow_blueprints(id) on delete set null, status public.run_status not null default 'created',
  input jsonb not null default '{}'::jsonb, output jsonb, created_by uuid not null references auth.users(id),
  started_at timestamptz, finished_at timestamptz, created_at timestamptz not null default now()
);
create table public.run_events (
  id bigint generated always as identity primary key, run_id uuid not null references public.agent_runs(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade, event_type text not null,
  payload jsonb not null default '{}'::jsonb, actor_id uuid references auth.users(id), created_at timestamptz not null default now()
);
create table public.approvals (
  id uuid primary key default gen_random_uuid(), run_id uuid not null references public.agent_runs(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade, action_key text not null,
  parameters_hash text not null, status text not null default 'pending' check(status in ('pending','approved','rejected','expired')),
  requested_by uuid references auth.users(id), decided_by uuid references auth.users(id), expires_at timestamptz not null,
  decided_at timestamptz, created_at timestamptz not null default now()
);
create table public.tool_executions (
  id uuid primary key default gen_random_uuid(), run_id uuid not null references public.agent_runs(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade, tool_name text not null,
  idempotency_key text not null, status text not null check(status in ('requested','approved','running','succeeded','failed','reconciled')),
  input jsonb not null default '{}'::jsonb, output jsonb, created_at timestamptz not null default now(), unique(organization_id,idempotency_key)
);
create table public.audit_log (
  id bigint generated always as identity primary key, organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id), action text not null, resource_type text not null, resource_id text,
  details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create or replace function private.bootstrap_organization_owner() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.memberships(organization_id,user_id,role) values(new.id,new.owner_id,'owner');
  return new;
end;
$$;
revoke all on function private.bootstrap_organization_owner() from public;
create trigger organization_owner_membership after insert on public.organizations for each row execute function private.bootstrap_organization_owner();

create or replace function private.is_org_member(org_id uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.memberships m where m.organization_id=org_id and m.user_id=(select auth.uid()));
$$;
create or replace function private.has_org_role(org_id uuid, accepted public.member_role[]) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.memberships m where m.organization_id=org_id and m.user_id=(select auth.uid()) and m.role=any(accepted));
$$;
revoke all on function private.is_org_member(uuid) from public;
revoke all on function private.has_org_role(uuid,public.member_role[]) from public;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid,public.member_role[]) to authenticated;

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.workflow_blueprints enable row level security;
alter table public.agent_runs enable row level security;
alter table public.run_events enable row level security;
alter table public.approvals enable row level security;
alter table public.tool_executions enable row level security;
alter table public.audit_log enable row level security;

create policy organizations_select on public.organizations for select to authenticated using (private.is_org_member(id) or owner_id=(select auth.uid()));
create policy organizations_insert on public.organizations for insert to authenticated with check (owner_id=(select auth.uid()));
create policy organizations_update on public.organizations for update to authenticated using (private.has_org_role(id,array['owner','admin']::public.member_role[])) with check (private.has_org_role(id,array['owner','admin']::public.member_role[]));
create policy memberships_select on public.memberships for select to authenticated using (private.is_org_member(organization_id));
create policy memberships_manage on public.memberships for all to authenticated using (private.has_org_role(organization_id,array['owner','admin']::public.member_role[])) with check (private.has_org_role(organization_id,array['owner','admin']::public.member_role[]));
create policy blueprints_select on public.workflow_blueprints for select to authenticated using (private.is_org_member(organization_id));
create policy blueprints_write on public.workflow_blueprints for all to authenticated using (private.has_org_role(organization_id,array['owner','admin','operator']::public.member_role[])) with check (private.has_org_role(organization_id,array['owner','admin','operator']::public.member_role[]) and created_by=(select auth.uid()));
create policy runs_select on public.agent_runs for select to authenticated using (private.is_org_member(organization_id));
create policy runs_insert on public.agent_runs for insert to authenticated with check (private.has_org_role(organization_id,array['owner','admin','operator']::public.member_role[]) and created_by=(select auth.uid()));
create policy events_select on public.run_events for select to authenticated using (private.is_org_member(organization_id));
create policy approvals_select on public.approvals for select to authenticated using (private.is_org_member(organization_id));
create policy approvals_decide on public.approvals for update to authenticated using (private.has_org_role(organization_id,array['owner','admin']::public.member_role[])) with check (private.has_org_role(organization_id,array['owner','admin']::public.member_role[]) and decided_by=(select auth.uid()));
create policy tools_select on public.tool_executions for select to authenticated using (private.is_org_member(organization_id));
create policy audit_select on public.audit_log for select to authenticated using (private.has_org_role(organization_id,array['owner','admin']::public.member_role[]));

create index runs_org_created_idx on public.agent_runs(organization_id,created_at desc);
create index events_run_created_idx on public.run_events(run_id,created_at);
create index approvals_pending_idx on public.approvals(organization_id,expires_at) where status='pending';
create index audit_org_created_idx on public.audit_log(organization_id,created_at desc);
