-- Consolidate verified source ruereqpvykwnakcnmxha into empty target yhjyaytbrsuwaefkqkqg.

-- Source schema inspected on 13 October 2026. No auth users or business conversations to migrate.

-- Additive initialization only: refuses any preexisting application table to prevent overwrites.

do $$ begin if exists(select 1 from pg_tables where schemaname='public' and tablename like 'agentnexos%') then raise exception 'TARGET_NOT_EMPTY'; end if; end $$;

create table public.agentnexos_demo_requests (
  id uuid default gen_random_uuid() not null,
  subject_hash text not null,
  created_at timestamp with time zone default now() not null,
  status text default 'reserved'::text not null,
  stages jsonb default '[]'::jsonb not null,
  completed_at timestamp with time zone
);

create table public.agentnexos_demo_limits (
  singleton boolean default true not null,
  connection_daily_limit integer not null,
  global_daily_limit integer not null
);

create table public.agentnexos_profiles (
  id uuid not null,
  display_name text default ''::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.agentnexos_conversations (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  title text not null,
  locale text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.agentnexos_messages (
  id uuid default gen_random_uuid() not null,
  conversation_id uuid not null,
  user_id uuid not null,
  request_id uuid not null,
  role text not null,
  content text not null,
  sequence bigint generated always as identity not null,
  created_at timestamp with time zone default now() not null
);

alter table public.agentnexos_demo_requests add constraint agentnexos_demo_requests_subject_hash_check CHECK ((length(subject_hash) = 64));

alter table public.agentnexos_demo_requests add constraint agentnexos_demo_requests_status_check CHECK ((status = ANY (ARRAY['reserved'::text, 'running'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])));

alter table public.agentnexos_demo_requests add constraint agentnexos_demo_requests_pkey PRIMARY KEY (id);

alter table public.agentnexos_demo_limits add constraint agentnexos_demo_limits_singleton_check CHECK (singleton);

alter table public.agentnexos_demo_limits add constraint agentnexos_demo_limits_connection_daily_limit_check CHECK (((connection_daily_limit >= 1) AND (connection_daily_limit <= 1000000)));

alter table public.agentnexos_demo_limits add constraint agentnexos_demo_limits_check CHECK (((global_daily_limit >= connection_daily_limit) AND (global_daily_limit <= 1000000)));

alter table public.agentnexos_demo_limits add constraint agentnexos_demo_limits_pkey PRIMARY KEY (singleton);

alter table public.agentnexos_profiles add constraint agentnexos_profiles_display_name_check CHECK ((char_length(display_name) <= 100));

alter table public.agentnexos_profiles add constraint agentnexos_profiles_pkey PRIMARY KEY (id);

alter table public.agentnexos_profiles add constraint agentnexos_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.agentnexos_conversations add constraint agentnexos_conversations_title_check CHECK (((char_length(title) >= 1) AND (char_length(title) <= 120)));

alter table public.agentnexos_conversations add constraint agentnexos_conversations_locale_check CHECK ((locale = ANY (ARRAY['ar'::text, 'en'::text])));

alter table public.agentnexos_conversations add constraint agentnexos_conversations_pkey PRIMARY KEY (id);

alter table public.agentnexos_conversations add constraint agentnexos_conversations_id_user_id_key UNIQUE (id, user_id);

alter table public.agentnexos_conversations add constraint agentnexos_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.agentnexos_messages add constraint agentnexos_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])));

alter table public.agentnexos_messages add constraint agentnexos_messages_content_check CHECK (((char_length(content) >= 1) AND (char_length(content) <= 16000)));

alter table public.agentnexos_messages add constraint agentnexos_messages_pkey PRIMARY KEY (id);

alter table public.agentnexos_messages add constraint agentnexos_messages_request_id_role_key UNIQUE (request_id, role);

alter table public.agentnexos_messages add constraint agentnexos_messages_conversation_id_sequence_key UNIQUE (conversation_id, sequence);

alter table public.agentnexos_messages add constraint agentnexos_messages_conversation_id_user_id_fkey FOREIGN KEY (conversation_id, user_id) REFERENCES agentnexos_conversations(id, user_id) ON DELETE CASCADE;

CREATE INDEX agentnexos_demo_time_idx ON public.agentnexos_demo_requests USING btree (created_at);

CREATE INDEX agentnexos_demo_subject_idx ON public.agentnexos_demo_requests USING btree (subject_hash, created_at);

CREATE INDEX agentnexos_conversations_owner_updated ON public.agentnexos_conversations USING btree (user_id, updated_at DESC);

CREATE INDEX agentnexos_messages_owner_conversation ON public.agentnexos_messages USING btree (user_id, conversation_id);

alter table public.agentnexos_demo_requests enable row level security;

revoke all on public.agentnexos_demo_requests from public, anon, authenticated, service_role;

alter table public.agentnexos_demo_limits enable row level security;

revoke all on public.agentnexos_demo_limits from public, anon, authenticated, service_role;

alter table public.agentnexos_profiles enable row level security;

revoke all on public.agentnexos_profiles from public, anon, authenticated, service_role;

alter table public.agentnexos_conversations enable row level security;

revoke all on public.agentnexos_conversations from public, anon, authenticated, service_role;

alter table public.agentnexos_messages enable row level security;

revoke all on public.agentnexos_messages from public, anon, authenticated, service_role;

create policy profile_update_own on public.agentnexos_profiles for update to authenticated using ((( SELECT auth.uid() AS uid) = id)) with check ((( SELECT auth.uid() AS uid) = id));

create policy profile_insert_own on public.agentnexos_profiles for insert to authenticated with check ((( SELECT auth.uid() AS uid) = id));

create policy profile_select_own on public.agentnexos_profiles for select to authenticated using ((( SELECT auth.uid() AS uid) = id));

create policy conversations_delete_own on public.agentnexos_conversations for delete to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

create policy conversations_select_own on public.agentnexos_conversations for select to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

create policy messages_select_own on public.agentnexos_messages for select to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

grant DELETE on public.agentnexos_conversations to authenticated;

grant SELECT on public.agentnexos_conversations to authenticated;

grant DELETE on public.agentnexos_conversations to service_role;

grant INSERT on public.agentnexos_conversations to service_role;

grant REFERENCES on public.agentnexos_conversations to service_role;

grant SELECT on public.agentnexos_conversations to service_role;

grant TRIGGER on public.agentnexos_conversations to service_role;

grant TRUNCATE on public.agentnexos_conversations to service_role;

grant UPDATE on public.agentnexos_conversations to service_role;

grant SELECT on public.agentnexos_demo_limits to service_role;

grant DELETE on public.agentnexos_demo_requests to service_role;

grant INSERT on public.agentnexos_demo_requests to service_role;

grant REFERENCES on public.agentnexos_demo_requests to service_role;

grant SELECT on public.agentnexos_demo_requests to service_role;

grant TRIGGER on public.agentnexos_demo_requests to service_role;

grant TRUNCATE on public.agentnexos_demo_requests to service_role;

grant UPDATE on public.agentnexos_demo_requests to service_role;

grant SELECT on public.agentnexos_messages to authenticated;

grant DELETE on public.agentnexos_messages to service_role;

grant INSERT on public.agentnexos_messages to service_role;

grant REFERENCES on public.agentnexos_messages to service_role;

grant SELECT on public.agentnexos_messages to service_role;

grant TRIGGER on public.agentnexos_messages to service_role;

grant TRUNCATE on public.agentnexos_messages to service_role;

grant UPDATE on public.agentnexos_messages to service_role;

grant INSERT on public.agentnexos_profiles to authenticated;

grant SELECT on public.agentnexos_profiles to authenticated;

grant UPDATE on public.agentnexos_profiles to authenticated;

grant DELETE on public.agentnexos_profiles to service_role;

grant INSERT on public.agentnexos_profiles to service_role;

grant REFERENCES on public.agentnexos_profiles to service_role;

grant SELECT on public.agentnexos_profiles to service_role;

grant TRIGGER on public.agentnexos_profiles to service_role;

grant TRUNCATE on public.agentnexos_profiles to service_role;

grant UPDATE on public.agentnexos_profiles to service_role;

revoke all on sequence public.agentnexos_messages_sequence_seq from public, anon, authenticated;

grant usage, select on sequence public.agentnexos_messages_sequence_seq to service_role;

CREATE OR REPLACE FUNCTION public.agentnexos_demo_ready()
 RETURNS boolean
 LANGUAGE sql
 SET search_path TO ''
AS $function$
  select exists(select 1 from pg_catalog.pg_class where oid = 'public.agentnexos_demo_requests'::regclass);
$function$;

revoke all on function public.agentnexos_demo_ready() from public, anon, authenticated;

grant execute on function public.agentnexos_demo_ready() to service_role;

CREATE OR REPLACE FUNCTION public.reserve_agentnexos_demo_v3(p_subject_hash text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$;

revoke all on function public.reserve_agentnexos_demo_v3(text) from public, anon, authenticated;

grant execute on function public.reserve_agentnexos_demo_v3(text) to service_role;

CREATE OR REPLACE FUNCTION public.reserve_agentnexos_demo_v2(p_subject_hash text)
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
  select public.reserve_agentnexos_demo_v3(p_subject_hash) - 'limit' - 'windowSeconds';
$function$;

revoke all on function public.reserve_agentnexos_demo_v2(text) from public, anon, authenticated;

grant execute on function public.reserve_agentnexos_demo_v2(text) to service_role;

CREATE OR REPLACE FUNCTION public.reserve_agentnexos_demo(p_subject_hash text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare reservation jsonb;
begin
  reservation := public.reserve_agentnexos_demo_v2(p_subject_hash);
  if reservation->>'code' = 'RESERVED' then return (reservation->>'runId')::uuid; end if;
  return null;
end;
$function$;

revoke all on function public.reserve_agentnexos_demo(text) from public, anon, authenticated;

grant execute on function public.reserve_agentnexos_demo(text) to service_role;

CREATE OR REPLACE FUNCTION public.agentnexos_begin_turn(p_user_id uuid, p_conversation_id uuid, p_request_id uuid, p_content text, p_locale text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare v_id uuid; v_owner uuid; v_count bigint;
begin
 if p_locale not in ('ar','en') or char_length(p_content) not between 1 and 4000 then raise exception 'INVALID_TURN'; end if;
 if exists(select 1 from public.agentnexos_messages where request_id=p_request_id) then raise exception 'DUPLICATE_TURN'; end if;
 if p_conversation_id is null then
  select count(*) into v_count from public.agentnexos_conversations where user_id=p_user_id;
  if v_count >= 200 then raise exception 'CONVERSATION_LIMIT'; end if;
  insert into public.agentnexos_conversations(user_id,title,locale) values(p_user_id,left(p_content,120),p_locale) returning id into v_id;
 else
  select user_id into v_owner from public.agentnexos_conversations where id=p_conversation_id for update;
  if v_owner is distinct from p_user_id then raise exception 'CONVERSATION_UNAVAILABLE'; end if;
  v_id:=p_conversation_id;
 end if;
 select count(*) into v_count from public.agentnexos_messages where conversation_id=v_id;
 if v_count >= 200 then raise exception 'MESSAGE_LIMIT'; end if;
 insert into public.agentnexos_messages(conversation_id,user_id,request_id,role,content) values(v_id,p_user_id,p_request_id,'user',p_content);
 update public.agentnexos_conversations set updated_at=now() where id=v_id;
 return v_id;
end $function$;

revoke all on function public.agentnexos_begin_turn(uuid, uuid, uuid, text, text) from public, anon, authenticated;

grant execute on function public.agentnexos_begin_turn(uuid, uuid, uuid, text, text) to service_role;

insert into public.agentnexos_demo_limits(singleton,connection_daily_limit,global_daily_limit) values(true,1000,10000);
