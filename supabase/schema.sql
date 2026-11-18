-- florii · Supabase schema
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It is safe to run more than once. It only creates florii_* tables and the shared
-- dashboard_apps table, so Meowdration's orders / sponsors / waitlist are untouched.
--
-- Row Level Security is on with no policies: nothing is readable from a browser.
-- Only the server, using the secret key, can read or write these tables.

-- ─────────────────────────────────────────────────────────────
-- Sponsors: one row per sponsor checkout, from start to payment.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.florii_sponsors (
  id                   uuid primary key default gen_random_uuid(),
  product              text not null,
  link                 text not null,
  description          text not null default '',
  email                text not null,
  amount               integer not null,                 -- smallest unit (cents for USD)
  currency             text not null default 'USD',
  razorpay_order_id    text unique not null,
  razorpay_payment_id  text unique,
  status               text not null default 'created'
                       check (status in ('created', 'paid', 'failed', 'featured', 'rejected', 'refunded')),
  featured             boolean not null default false,   -- shown in the sponsor section on the site
  logo_url             text,
  note                 text,                              -- your private note from the dashboard
  created_at           timestamptz not null default now(),
  paid_at              timestamptz,
  updated_at           timestamptz not null default now()
);

create index if not exists florii_sponsors_status_idx  on public.florii_sponsors (status);
create index if not exists florii_sponsors_created_idx on public.florii_sponsors (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Visits: one row per page view. Powers the visitors counter
-- and the traffic charts in the dashboard. No personal data.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.florii_visits (
  id          bigint generated always as identity primary key,
  path        text not null,
  referrer    text,
  country     text,
  device      text check (device in ('desktop', 'mobile', 'tablet')),
  visitor     text,          -- random id kept in the visitor's browser, never their name or IP
  created_at  timestamptz not null default now()
);

create index if not exists florii_visits_created_idx on public.florii_visits (created_at desc);
create index if not exists florii_visits_path_idx    on public.florii_visits (path);

-- ─────────────────────────────────────────────────────────────
-- Dashboard apps: the apps your dashboard can switch between.
-- Shared by every app, so it has no florii_ prefix.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.dashboard_apps (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,     -- e.g. 'florii', 'meowdration'
  name        text not null,
  url         text,
  logo_url    text,
  accent      text default '#131316',
  table_prefix text,                    -- e.g. 'florii_' ; empty for Meowdration's own tables
  created_at  timestamptz not null default now()
);

insert into public.dashboard_apps (slug, name, url, table_prefix)
values
  ('florii', 'florii', 'https://floriii.vercel.app', 'florii_'),
  ('meowdration', 'Meowdration', null, '')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Keep updated_at fresh on sponsor changes.
-- ─────────────────────────────────────────────────────────────
create or replace function public.florii_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists florii_sponsors_touch on public.florii_sponsors;
create trigger florii_sponsors_touch
  before update on public.florii_sponsors
  for each row execute function public.florii_touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Security: on, with no policies → server (secret key) only.
-- ─────────────────────────────────────────────────────────────
alter table public.florii_sponsors enable row level security;
alter table public.florii_visits   enable row level security;
alter table public.dashboard_apps  enable row level security;

-- ─────────────────────────────────────────────────────────────
-- Checkout contact details (added later; safe to run more than once).
-- ─────────────────────────────────────────────────────────────
alter table public.florii_sponsors add column if not exists name    text;
alter table public.florii_sponsors add column if not exists phone   text;
alter table public.florii_sponsors add column if not exists country text;
alter table public.florii_sponsors add column if not exists address text;

-- Visitor counter: marks the first page of each visit, so every visit counts once (safe to re-run).
alter table public.florii_visits add column if not exists first_visit boolean not null default false;
create index if not exists florii_visits_first_idx on public.florii_visits (first_visit) where first_visit;
