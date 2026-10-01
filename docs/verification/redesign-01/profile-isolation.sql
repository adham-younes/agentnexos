begin;
insert into auth.users(id,email) values ('11111111-1111-4111-8111-111111111111','rls-a@example.invalid'),('22222222-2222-4222-8222-222222222222','rls-b@example.invalid');
insert into public.agentnexos_profiles(id,display_name) values ('11111111-1111-4111-8111-111111111111','A'),('22222222-2222-4222-8222-222222222222','B');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
if (select count(*) from public.agentnexos_profiles) <> 1 then raise exception 'Isolation failed'; end if;
update public.agentnexos_profiles set display_name='own' where id='11111111-1111-4111-8111-111111111111';
if not found then raise exception 'Own update failed'; end if;
update public.agentnexos_profiles set display_name='attack' where id='22222222-2222-4222-8222-222222222222';
if found then raise exception 'Cross-user update allowed'; end if;
begin
 insert into public.agentnexos_profiles(id) values ('33333333-3333-4333-8333-333333333333');
 raise exception 'Cross-user insert allowed';
exception when insufficient_privilege then null;
end;
end $$;
select 'PASS: own read/update; cross-user read/update/insert blocked; fixtures rolled back' as result;
rollback;
