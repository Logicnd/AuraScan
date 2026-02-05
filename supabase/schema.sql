-- Core user profile table synced with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Email is duplicated from auth.users for convenience in profile queries; sync happens via triggers below.
  email text not null,
  name text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- SECURITY DEFINER is required so auth.users trigger can write to profiles under RLS.
create or replace function public.sync_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.profiles (id, email)
    values (new.id, new.email);
  elsif tg_op = 'UPDATE' then
    if new.email is distinct from old.email then
      update public.profiles
      set email = new.email
      where id = new.id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.sync_user_profile();

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (new.email is distinct from old.email)
  execute function public.sync_user_profile();

-- Profiles are created via the auth.users trigger; manual inserts are not required.
-- Deletes are handled by the auth.users foreign key cascade.
-- RLS default-deny prevents client-side inserts/deletes without explicit policies.
alter table public.profiles enable row level security;

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.set_profile_updated_at();

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
