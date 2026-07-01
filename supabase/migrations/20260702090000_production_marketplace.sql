-- Production marketplace foundation for digital products, paid unlocks, and community access.

alter table public.digital_products
  add column if not exists slug text,
  add column if not exists product_type text not null default 'download'
    check (product_type in ('course', 'software', 'community', 'download', 'bundle')),
  add column if not exists subtitle text not null default '',
  add column if not exists currency text not null default 'INR',
  add column if not exists cover_url text not null default '',
  add column if not exists access_url text not null default '',
  add column if not exists demo_url text not null default '',
  add column if not exists telegram_chat_id text not null default '',
  add column if not exists telegram_invite_url text not null default '',
  add column if not exists license_terms text not null default '',
  add column if not exists includes text[] not null default '{}',
  add column if not exists seller_name text not null default '',
  add column if not exists support_email text not null default '';

update public.digital_products
set
  cover_url = coalesce(nullif(cover_url, ''), thumbnail_url),
  slug = coalesce(
    slug,
    lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) || '-' || left(id::text, 8)
  )
where slug is null;

create unique index if not exists digital_products_slug_key on public.digital_products (slug);
create index if not exists digital_products_product_type_idx on public.digital_products (product_type);
create index if not exists digital_products_active_idx
  on public.digital_products (created_at desc)
  where status = 'active';

create table if not exists public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  currency text not null default 'INR',
  subtotal numeric(12, 2) not null default 0,
  platform_fee numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  payment_provider text not null default 'stripe',
  provider_checkout_id text,
  provider_payment_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.marketplace_orders(id) on delete cascade,
  product_id uuid not null references public.digital_products(id) on delete restrict,
  seller_id uuid not null references auth.users(id) on delete restrict,
  title text not null,
  product_type text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.marketplace_orders(id) on delete cascade,
  provider text not null,
  provider_event_id text not null,
  provider_payment_id text,
  status text not null,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'INR',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(provider, provider_event_id)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.digital_products(id) on delete cascade,
  order_id uuid not null references public.marketplace_orders(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete restrict,
  access_type text not null default 'lifetime'
    check (access_type in ('lifetime', 'subscription', 'time_limited')),
  status text not null default 'active'
    check (status in ('active', 'revoked', 'expired', 'refunded')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, product_id, order_id)
);

create table if not exists public.telegram_access_grants (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.entitlements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.digital_products(id) on delete cascade,
  telegram_chat_id text not null default '',
  invite_url text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'granted', 'revoked', 'failed')),
  granted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_orders_buyer_idx on public.marketplace_orders (buyer_id, created_at desc);
create index if not exists marketplace_order_items_seller_idx on public.marketplace_order_items (seller_id, created_at desc);
create index if not exists entitlements_user_idx on public.entitlements (user_id, created_at desc);
create index if not exists entitlements_product_idx on public.entitlements (product_id);
create unique index if not exists telegram_access_entitlement_key
  on public.telegram_access_grants (entitlement_id);

alter table public.marketplace_orders enable row level security;
alter table public.marketplace_order_items enable row level security;
alter table public.marketplace_payments enable row level security;
alter table public.entitlements enable row level security;
alter table public.telegram_access_grants enable row level security;

drop policy if exists "orders_buyer_read" on public.marketplace_orders;
create policy "orders_buyer_read"
  on public.marketplace_orders for select
  using (auth.uid() = buyer_id);

drop policy if exists "order_items_buyer_or_seller_read" on public.marketplace_order_items;
create policy "order_items_buyer_or_seller_read"
  on public.marketplace_order_items for select
  using (
    seller_id = auth.uid()
    or exists (
      select 1 from public.marketplace_orders o
      where o.id = order_id and o.buyer_id = auth.uid()
    )
  );

drop policy if exists "entitlements_buyer_read" on public.entitlements;
create policy "entitlements_buyer_read"
  on public.entitlements for select
  using (auth.uid() = user_id or auth.uid() = seller_id);

drop policy if exists "telegram_access_buyer_read" on public.telegram_access_grants;
create policy "telegram_access_buyer_read"
  on public.telegram_access_grants for select
  using (auth.uid() = user_id);

drop trigger if exists marketplace_orders_updated_at on public.marketplace_orders;
create trigger marketplace_orders_updated_at
  before update on public.marketplace_orders
  for each row execute function public.set_updated_at();
