-- Run in Supabase SQL Editor for admin payment settings + campaign management

create table if not exists public.payment_settings (
  id text primary key default 'default',
  paytm_upi_id text not null default '',
  merchant_name text not null default 'Digital Marketplace',
  currency text not null default 'INR',
  updated_at timestamptz not null default now()
);

alter table public.payment_settings enable row level security;

drop policy if exists "payment_settings_read" on public.payment_settings;
create policy "payment_settings_read"
  on public.payment_settings for select
  using (true);

drop policy if exists "payment_settings_write_authenticated" on public.payment_settings;
create policy "payment_settings_write_authenticated"
  on public.payment_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.payment_settings (id, paytm_upi_id, merchant_name, currency)
values ('default', '', 'Digital Marketplace', 'INR')
on conflict (id) do nothing;

-- Seller product manager: each seller CRUDs only their own campaigns
alter table public.campaigns enable row level security;

drop policy if exists "campaigns_public_read" on public.campaigns;
create policy "campaigns_public_read"
  on public.campaigns for select
  using (status = 'active' or auth.uid() = seller_id);

drop policy if exists "campaigns_seller_insert" on public.campaigns;
create policy "campaigns_seller_insert"
  on public.campaigns for insert
  with check (auth.uid() = seller_id);

drop policy if exists "campaigns_seller_update" on public.campaigns;
create policy "campaigns_seller_update"
  on public.campaigns for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

drop policy if exists "campaigns_seller_delete" on public.campaigns;
create policy "campaigns_seller_delete"
  on public.campaigns for delete
  using (auth.uid() = seller_id);
