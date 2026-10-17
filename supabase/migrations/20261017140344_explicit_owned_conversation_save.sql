-- Additive follow-up only. Apply after reconciling the live consolidation
-- migration identifier; never replay the historical empty-target initializer.
-- No auth users, existing conversation rows or enterprise permissions are reset.
do $$
begin
  if to_regclass('public.agentnexos_conversations') is null
     or to_regclass('public.agentnexos_messages') is null
     or to_regclass('public.agentnexos_profiles') is null then
    raise exception 'EXPECTED_AGENTNEXOS_SCHEMA_MISSING';
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.agentnexos_messages'::regclass
      and conname = 'agentnexos_messages_conversation_id_user_id_fkey'
      and contype = 'f' and confdeltype = 'c'
  ) then raise exception 'EXPECTED_OWNER_CASCADE_MISSING'; end if;
end $$;

alter table public.agentnexos_conversations
  add column revision integer not null default 0 check (revision >= 0),
  add column last_save_id uuid,
  add column last_save_hash text check (last_save_hash is null or length(last_save_hash) = 64);

-- A service-only invoker function supplies the transactional boundary for an
-- explicitly saved text snapshot. API handlers verify the current Supabase user
-- on every request and supply p_user_id; callers cannot invoke it as anon/user.
create function public.agentnexos_save_conversation(
  p_user_id uuid, p_conversation_id uuid, p_expected_revision integer,
  p_request_id uuid, p_title text, p_locale text, p_messages jsonb,
  p_payload_hash text
) returns table(id uuid, title text, locale text, created_at timestamptz, updated_at timestamptz, revision integer)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_current public.agentnexos_conversations%rowtype;
  v_message jsonb;
  v_size bigint := 0;
  v_owned_size bigint;
  v_count integer;
  v_now timestamptz := now();
begin
  if p_user_id is null or p_conversation_id is null or p_request_id is null
     or p_expected_revision is null or p_expected_revision < 0
     or p_title is null or char_length(btrim(p_title)) not between 1 and 120
     or p_locale is null or p_locale not in ('ar','en')
     or p_payload_hash is null or p_payload_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'INVALID_SNAPSHOT';
  end if;
  if p_messages is not null then
    if jsonb_typeof(p_messages) <> 'array' then raise exception 'INVALID_SNAPSHOT'; end if;
    if jsonb_array_length(p_messages) not between 1 and 80 then raise exception 'INVALID_SNAPSHOT'; end if;
    for v_message in select value from jsonb_array_elements(p_messages) loop
      if jsonb_typeof(v_message) <> 'object'
         or jsonb_typeof(v_message->'content') is distinct from 'string'
         or (v_message->>'role') is null or (v_message->>'role') not in ('user','assistant')
         or char_length(v_message->>'content') not between 1 and 16000 then
        raise exception 'INVALID_SNAPSHOT';
      end if;
      v_size := v_size + char_length(v_message->>'content');
    end loop;
    if v_size > 120000 then raise exception 'INVALID_SNAPSHOT'; end if;
  end if;

  -- Serialize this owner's saves to enforce quota under concurrent requests.
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  select c.* into v_current from public.agentnexos_conversations c
    where c.id = p_conversation_id and c.user_id = p_user_id for update;
  if found then
    if v_current.last_save_id = p_request_id then
      if v_current.last_save_hash is distinct from p_payload_hash then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
      return query select c.id,c.title,c.locale,c.created_at,c.updated_at,c.revision
        from public.agentnexos_conversations c where c.id = v_current.id and c.user_id = p_user_id;
      return;
    end if;
    if v_current.revision <> p_expected_revision then raise exception 'SAVE_CONFLICT'; end if;
  else
    if p_expected_revision <> 0 or p_messages is null then raise exception 'CONVERSATION_UNAVAILABLE'; end if;
    if exists(select 1 from public.agentnexos_conversations c where c.id = p_conversation_id) then raise exception 'CONVERSATION_UNAVAILABLE'; end if;
    select count(*) into v_count from public.agentnexos_conversations c where c.user_id = p_user_id;
    if v_count >= 100 then raise exception 'CONVERSATION_LIMIT'; end if;
  end if;
  if exists(select 1 from public.agentnexos_conversations c
    where c.user_id = p_user_id and c.updated_at > v_now - interval '1 second') then
    raise exception 'SAVE_RATE_LIMIT';
  end if;
  if p_messages is not null then
    select coalesce(sum(char_length(m.content)),0) into v_owned_size
      from public.agentnexos_messages m where m.user_id = p_user_id and m.conversation_id <> p_conversation_id;
    if v_owned_size + v_size > 2000000 then raise exception 'STORAGE_LIMIT'; end if;
  end if;
  if v_current.id is null then
    insert into public.agentnexos_conversations(id,user_id,title,locale,revision,last_save_id,last_save_hash)
      values(p_conversation_id,p_user_id,btrim(p_title),p_locale,1,p_request_id,p_payload_hash);
  else
    update public.agentnexos_conversations c set title=btrim(p_title),locale=p_locale,
      updated_at=v_now,revision=c.revision+1,last_save_id=p_request_id,last_save_hash=p_payload_hash
      where c.id=p_conversation_id and c.user_id=p_user_id;
  end if;
  if p_messages is not null then
    delete from public.agentnexos_messages m where m.conversation_id=p_conversation_id and m.user_id=p_user_id;
    for v_message in select value from jsonb_array_elements(p_messages) loop
      insert into public.agentnexos_messages(conversation_id,user_id,request_id,role,content)
        values(p_conversation_id,p_user_id,gen_random_uuid(),v_message->>'role',v_message->>'content');
    end loop;
  end if;
  return query select c.id,c.title,c.locale,c.created_at,c.updated_at,c.revision
    from public.agentnexos_conversations c where c.id=p_conversation_id and c.user_id=p_user_id;
end $$;

revoke all on function public.agentnexos_save_conversation(uuid,uuid,integer,uuid,text,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.agentnexos_save_conversation(uuid,uuid,integer,uuid,text,text,jsonb,text) to service_role;
-- Existing owner SELECT/DELETE RLS and composite ON DELETE CASCADE remain in force.
-- Rollback: disable the history API/UI first; keep these additive columns/function
-- for backward-compatible recovery. No destructive down migration is required.
