-- Digital products for AI promptstore (Supabase-native)

create table if not exists public.digital_products (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'General',
  price numeric(12, 2) not null default 0,
  tags text[] not null default '{}',
  thumbnail_url text not null default '',
  thumbnail_prompt text not null default '',
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists digital_products_creator_idx on public.digital_products (creator_id);
create index if not exists digital_products_status_idx on public.digital_products (status);

alter table public.digital_products enable row level security;

drop policy if exists "digital_products_public_read" on public.digital_products;
create policy "digital_products_public_read"
  on public.digital_products for select
  using (status = 'active' or auth.uid() = creator_id);

drop policy if exists "digital_products_creator_insert" on public.digital_products;
create policy "digital_products_creator_insert"
  on public.digital_products for insert
  with check (auth.uid() = creator_id);

drop policy if exists "digital_products_creator_update" on public.digital_products;
create policy "digital_products_creator_update"
  on public.digital_products for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

drop policy if exists "digital_products_creator_delete" on public.digital_products;
create policy "digital_products_creator_delete"
  on public.digital_products for delete
  using (auth.uid() = creator_id);

drop trigger if exists digital_products_updated_at on public.digital_products;
create trigger digital_products_updated_at
  before update on public.digital_products
  for each row execute function public.set_updated_at();
