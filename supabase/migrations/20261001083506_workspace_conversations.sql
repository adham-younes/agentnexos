create table public.agentnexos_conversations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 locale text not null check (locale in ('ar','en')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(id,user_id)
);
create index agentnexos_conversations_owner_updated on public.agentnexos_conversations(user_id,updated_at desc);
create table public.agentnexos_messages (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null,
 user_id uuid not null,
 request_id uuid not null,
 role text not null check (role in ('user','assistant')),
 content text not null check (char_length(content) between 1 and 16000),
 sequence bigint generated always as identity,
 created_at timestamptz not null default now(),
 foreign key(conversation_id,user_id) references public.agentnexos_conversations(id,user_id) on delete cascade,
 unique(request_id,role),
 unique(conversation_id,sequence)
);
create index agentnexos_messages_owner_conversation on public.agentnexos_messages(user_id,conversation_id);
alter table public.agentnexos_conversations enable row level security;
alter table public.agentnexos_messages enable row level security;
revoke all on public.agentnexos_conversations,public.agentnexos_messages from anon,authenticated;
grant select,delete on public.agentnexos_conversations to authenticated;
grant select on public.agentnexos_messages to authenticated;
create policy conversations_select_own on public.agentnexos_conversations for select to authenticated using ((select auth.uid())=user_id);
create policy conversations_delete_own on public.agentnexos_conversations for delete to authenticated using ((select auth.uid())=user_id);
create policy messages_select_own on public.agentnexos_messages for select to authenticated using ((select auth.uid())=user_id);
-- Only the verified application server may commit user turns or model output.
create function public.agentnexos_begin_turn(p_user_id uuid,p_conversation_id uuid,p_request_id uuid,p_content text,p_locale text) returns uuid language plpgsql security invoker set search_path='' as $$
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
end $$;
revoke all on function public.agentnexos_begin_turn(uuid,uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.agentnexos_begin_turn(uuid,uuid,uuid,text,text) to service_role;
grant all on public.agentnexos_conversations,public.agentnexos_messages to service_role;
grant usage,select on sequence public.agentnexos_messages_sequence_seq to service_role;
