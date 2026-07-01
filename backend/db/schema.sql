-- Supabase SQL for the external-link marketplace backend.
-- Run this in the Supabase SQL editor.
-- The backend uses SUPABASE_SERVICE_ROLE_KEY for database reads/writes and
-- Supabase Auth JWTs for user verification. Do not expose the service key.

create extension if not exists pgcrypto;

create table if not exists public.shops (
  shop_id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  shop_name text not null unique,
  shop_slug text not null unique,
  description text not null default '',
  logo_upload text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  product_id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(shop_id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  -- Sensitive: never expose this column in public APIs.
  content_link text not null,
  thumbnail text,
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  purchase_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(product_id) on delete cascade,
  shop_id uuid not null references public.shops(shop_id) on delete cascade,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'completed', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists shops_owner_id_idx on public.shops(owner_id);
create index if not exists shops_shop_slug_idx on public.shops(shop_slug);
create index if not exists products_shop_id_idx on public.products(shop_id);
create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_product_user_status_idx
  on public.purchases(product_id, user_id, payment_status);

alter table public.shops enable row level security;
alter table public.products enable row level security;
alter table public.purchases enable row level security;

-- Keep direct client access conservative. The Express backend uses service role,
-- while public product responses intentionally omit products.content_link.
drop policy if exists "shops_public_read" on public.shops;
create policy "shops_public_read"
  on public.shops for select
  using (true);

drop policy if exists "shops_owner_read" on public.shops;
create policy "shops_owner_read"
  on public.shops for select
  using (auth.uid() = owner_id);

drop policy if exists "purchases_owner_read" on public.purchases;
create policy "purchases_owner_read"
  on public.purchases for select
  using (auth.uid() = user_id);

-- No public direct SELECT policy on public.products because it contains
-- content_link. If you need browser-side Supabase reads, use this view instead.
create or replace view public.public_products as
select
  product_id,
  shop_id,
  title,
  description,
  price,
  thumbnail,
  created_at
from public.products;
