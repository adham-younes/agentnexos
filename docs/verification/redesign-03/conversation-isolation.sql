begin;
insert into auth.users(id,email) values ('11111111-1111-4111-8111-111111111111','chat-rls-a@example.invalid'),('22222222-2222-4222-8222-222222222222','chat-rls-b@example.invalid');
insert into public.agentnexos_conversations(id,user_id,title,locale) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','A','en'),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','B','en');
insert into public.agentnexos_messages(conversation_id,user_id,request_id,role,content) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','cccccccc-cccc-4ccc-8ccc-cccccccccccc','user','test'),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','dddddddd-dddd-4ddd-8ddd-dddddddddddd','assistant','private');
set local role service_role;
do $$ begin
perform public.agentnexos_begin_turn('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','second','en');
begin
perform public.agentnexos_begin_turn('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','duplicate','en');
raise exception 'Duplicate accepted';
exception when raise_exception then if SQLERRM <> 'DUPLICATE_TURN' then raise; end if; end;
begin
perform public.agentnexos_begin_turn('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','ffffffff-ffff-4fff-8fff-ffffffffffff','cross-user','en');
raise exception 'Cross-owner turn accepted';
exception when raise_exception then if SQLERRM <> 'CONVERSATION_UNAVAILABLE' then raise; end if; end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
if (select count(*) from public.agentnexos_conversations) <> 1 then raise exception 'Conversation isolation failed'; end if;
if (select count(*) from public.agentnexos_messages) <> 2 then raise exception 'Message isolation failed'; end if;
delete from public.agentnexos_conversations where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
if found then raise exception 'Cross-user delete accepted'; end if;
begin
insert into public.agentnexos_messages(conversation_id,user_id,request_id,role,content) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','ffffffff-ffff-4fff-8fff-ffffffffffff','assistant','forged');
raise exception 'Client model write accepted';
exception when insufficient_privilege then null; end;
begin
perform public.agentnexos_begin_turn('11111111-1111-4111-8111-111111111111',null,'ffffffff-ffff-4fff-8fff-ffffffffffff','forged','en');
raise exception 'Client RPC accepted';
exception when insufficient_privilege then null; end;
delete from public.agentnexos_conversations where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
if not found then raise exception 'Own delete failed'; end if;
if (select count(*) from public.agentnexos_messages) <> 0 then raise exception 'Cascade failed'; end if;
if has_table_privilege('anon','public.agentnexos_messages','SELECT') then raise exception 'Anonymous read granted'; end if;
end $$;
select 'PASS: own read/delete+cascade; cross-user read/delete/turn denied; client writes/RPC denied; duplicate turn denied; fixtures rolled back' as result;
rollback;
