create table if not exists public.profiles (
  id uuid primary key references auth.users (id),
  name text,
  skills text,
  available_hours int default 0,
  reputation int default 50,
  created_at timestamp default now()
);

create table if not exists public.stakes (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id),
  hours_staked int,
  status text,
  created_at timestamp default now()
);

create table if not exists public.tokens (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id),
  amount int,
  created_at timestamp default now()
);

create table if not exists public.tasks (
  id bigint generated always as identity primary key,
  title text,
  description text,
  created_by uuid references public.profiles (id),
  assigned_to uuid references public.profiles (id),
  reward int,
  status text,
  created_at timestamp default now()
);

create table if not exists public.token_transactions (
  id bigint generated always as identity primary key,
  from_user uuid,
  to_user uuid,
  task_id bigint references public.tasks (id),
  amount int,
  created_at timestamp default now()
);

create table if not exists public.organizations (
  id bigint generated always as identity primary key,
  name text,
  tokens_purchased int
);

create table if not exists public.audits (
  id bigint generated always as identity primary key,
  action text,
  user_id uuid,
  details jsonb,
  created_at timestamp default now()
);

create table if not exists public.reward_catalog (
  id bigint generated always as identity primary key,
  title text,
  description text,
  cost_tokens int not null,
  sponsor text,
  coupon_code text,
  inventory int default 0,
  metadata jsonb,
  created_at timestamp default now()
);

create table if not exists public.reward_redemptions (
  id bigint generated always as identity primary key,
  reward_id bigint references public.reward_catalog (id),
  user_id uuid references public.profiles (id),
  status text default 'pending',
  notes text,
  created_at timestamp default now()
);

create table if not exists public.token_orders (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id),
  buyer_name text,
  buyer_email text,
  buyer_type text,
  organization text,
  amount int,
  status text,
  created_at timestamp default now()
);

