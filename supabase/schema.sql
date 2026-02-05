-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER_STATS table (Gamification)
create table if not exists public.user_stats (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  level integer default 1,
  xp integer default 0,
  scans_conducted integer default 0,
  threats_neutralized integer default 0,
  energy_output text default '1.2 GW', -- Flavor text
  title text default 'Operative',
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SCANS table
create table if not exists public.scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  target_url text not null,
  score integer,
  issues jsonb default '[]'::jsonb,
  status text default 'completed', -- pending, completed, failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.scans enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- User Stats policies
create policy "User stats are viewable by everyone." on public.user_stats
  for select using (true);

create policy "Users can update own stats." on public.user_stats
  for update using (auth.uid() = user_id);

-- Scans policies
create policy "Users can view own scans." on public.scans
  for select using (auth.uid() = user_id);

create policy "Users can insert own scans." on public.scans
  for insert with check (auth.uid() = user_id);

-- TRIGGER for new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, split_part(new.email, '@', 1));
  
  insert into public.user_stats (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
