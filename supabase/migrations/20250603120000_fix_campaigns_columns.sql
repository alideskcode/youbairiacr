-- Run this in Supabase SQL Editor if you see "column campaigns.is_featured does not exist"

alter table public.campaigns add column if not exists slug text;
alter table public.campaigns add column if not exists banner_url text default '';
alter table public.campaigns add column if not exists thumbnail_url text default '';
alter table public.campaigns add column if not exists category text default 'General';
alter table public.campaigns add column if not exists budget_total numeric(12, 2) default 0;
alter table public.campaigns add column if not exists budget_remaining numeric(12, 2) default 0;
alter table public.campaigns add column if not exists avg_review_hours integer default 48;
alter table public.campaigns add column if not exists is_featured boolean default false;
alter table public.campaigns add column if not exists creator_id uuid references auth.users (id) on delete cascade;
alter table public.campaigns add column if not exists updated_at timestamptz default now();

-- Backfill slug from title where missing
update public.campaigns
set slug = lower(regexp_replace(regexp_replace(trim(title), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
  || '-' || substr(id::text, 1, 8)
where slug is null or slug = '';

-- Backfill creator_id from seller_id
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'campaigns' and column_name = 'seller_id'
  ) then
    update public.campaigns set creator_id = seller_id where creator_id is null and seller_id is not null;
  end if;
end $$;

-- Backfill thumbnail_url / budget from legacy columns
update public.campaigns
set thumbnail_url = coalesce(nullif(thumbnail_url, ''), thumbnail, '')
where exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'campaigns' and column_name = 'thumbnail'
);

update public.campaigns
set
  budget_total = coalesce(nullif(budget_total, 0), budget, 0),
  budget_remaining = coalesce(nullif(budget_remaining, 0), budget, 0)
where exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'campaigns' and column_name = 'budget'
);

create unique index if not exists campaigns_slug_idx on public.campaigns (slug);
