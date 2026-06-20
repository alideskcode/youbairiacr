-- Enhanced digital products with moderation, featuring, and file support

-- Add new columns to digital_products
alter table public.digital_products
  add column if not exists moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected')),
  add column if not exists featured boolean not null default false,
  add column if not exists admin_notes text,
  add column if not exists rejection_reason text,
  add column if not exists product_files jsonb not null default '[]'::jsonb,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id),
  add column if not exists rejected_at timestamptz,
  add column if not exists rejected_by uuid references auth.users(id);

-- Create indexes for new columns
create index if not exists digital_products_moderation_status_idx on public.digital_products (moderation_status);
create index if not exists digital_products_featured_idx on public.digital_products (featured) where featured = true;

-- Drop existing policies
drop policy if exists "digital_products_public_read" on public.digital_products;
drop policy if exists "digital_products_creator_insert" on public.digital_products;
drop policy if exists "digital_products_creator_update" on public.digital_products;
drop policy if exists "digital_products_creator_delete" on public.digital_products;

-- Public read: approved products + own products (any status)
create policy "digital_products_public_read"
  on public.digital_products for select
  using (
    moderation_status = 'approved' 
    or auth.uid() = creator_id
    or exists (
      select 1 from auth.users 
      where id = auth.uid() 
      and email in (select email from public.admin_users)
    )
  );

-- Creator insert: only pending/draft status
create policy "digital_products_creator_insert"
  on public.digital_products for insert
  with check (
    auth.uid() = creator_id
    and moderation_status in ('pending', 'draft')
  );

-- Creator update: own products, but cannot change moderation_status/featured/approved fields
create policy "digital_products_creator_update"
  on public.digital_products for update
  using (auth.uid() = creator_id)
  with check (
    auth.uid() = creator_id
    and (
      -- Allow updating these fields
      (moderation_status = old.moderation_status or moderation_status in ('pending', 'draft'))
      and featured = old.featured
      and (approved_at is not distinct from old.approved_at)
      and (approved_by is not distinct from old.approved_by)
      and (rejected_at is not distinct from old.rejected_at)
      and (rejected_by is not distinct from old.rejected_by)
    )
  );

-- Creator delete: own products only if not approved
create policy "digital_products_creator_delete"
  on public.digital_products for delete
  using (
    auth.uid() = creator_id
    and moderation_status != 'approved'
  );

-- Admin full access
create policy "digital_products_admin_all"
  on public.digital_products for all
  using (
    exists (
      select 1 from auth.users 
      where id = auth.uid() 
      and email in (select email from public.admin_users)
    )
  )
  with check (
    exists (
      select 1 from auth.users 
      where id = auth.uid() 
      and email in (select email from public.admin_users)
    )
  );

-- Ensure updated_at trigger exists
drop trigger if exists digital_products_updated_at on public.digital_products;
create trigger digital_products_updated_at
  before update on public.digital_products
  for each row execute function public.set_updated_at();

-- Create admin_users table if not exists (for RLS policies)
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Admin users readable by admins only
drop policy if exists "admin_users_read" on public.admin_users;
create policy "admin_users_read"
  on public.admin_users for select
  using (
    exists (
      select 1 from auth.users 
      where id = auth.uid() 
      and email in (select email from public.admin_users)
    )
  );