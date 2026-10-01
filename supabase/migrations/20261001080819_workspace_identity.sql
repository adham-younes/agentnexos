-- Auth is managed by Supabase; private application profile adds no privileges.
create table public.agentnexos_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (char_length(display_name) <= 100),
 created_at timestamptz not null default now()
);
alter table public.agentnexos_profiles enable row level security;
revoke all on public.agentnexos_profiles from anon, authenticated;
grant select, insert, update on public.agentnexos_profiles to authenticated;
create policy profile_select_own on public.agentnexos_profiles for select to authenticated using ((select auth.uid()) = id);
create policy profile_insert_own on public.agentnexos_profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profile_update_own on public.agentnexos_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
