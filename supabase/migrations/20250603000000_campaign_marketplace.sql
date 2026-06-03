-- Campaign Marketplace schema (run in Supabase SQL Editor or via CLI)

-- Profiles (roles: user, seller, admin)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'seller', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

drop policy if exists "profiles_read_public_display" on public.profiles;
create policy "profiles_read_public_display"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Campaigns (migrate legacy columns if present)
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  thumbnail_url text not null default '',
  banner_url text not null default '',
  category text not null default 'General',
  budget_total numeric(12, 2) not null default 0,
  budget_remaining numeric(12, 2) not null default 0,
  avg_review_hours integer not null default 48,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed')),
  is_featured boolean not null default false,
  creator_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Legacy column migration
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'campaigns' and column_name = 'seller_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'campaigns' and column_name = 'creator_id'
  ) then
    alter table public.campaigns add column creator_id uuid references auth.users (id) on delete cascade;
    update public.campaigns set creator_id = seller_id where creator_id is null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'campaigns' and column_name = 'thumbnail'
  ) then
    update public.campaigns set thumbnail_url = coalesce(thumbnail_url, thumbnail) where thumbnail_url = '' or thumbnail_url is null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'campaigns' and column_name = 'budget'
  ) then
    update public.campaigns
    set budget_total = coalesce(budget_total, budget),
        budget_remaining = coalesce(budget_remaining, budget)
    where budget_total = 0;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'campaigns' and column_name = 'platform'
  ) then
    update public.campaigns set category = coalesce(nullif(category, ''), platform, 'General')
    where category = 'General' or category is null;
  end if;
end $$;

alter table public.campaigns add column if not exists slug text;
alter table public.campaigns add column if not exists banner_url text not null default '';
alter table public.campaigns add column if not exists thumbnail_url text not null default '';
alter table public.campaigns add column if not exists category text not null default 'General';
alter table public.campaigns add column if not exists budget_total numeric(12, 2) not null default 0;
alter table public.campaigns add column if not exists budget_remaining numeric(12, 2) not null default 0;
alter table public.campaigns add column if not exists avg_review_hours integer not null default 48;
alter table public.campaigns add column if not exists is_featured boolean not null default false;
alter table public.campaigns add column if not exists creator_id uuid references auth.users (id) on delete cascade;
alter table public.campaigns add column if not exists updated_at timestamptz not null default now();

create unique index if not exists campaigns_slug_idx on public.campaigns (slug);

alter table public.campaigns enable row level security;

drop policy if exists "campaigns_public_read" on public.campaigns;
create policy "campaigns_public_read"
  on public.campaigns for select
  using (
    status = 'active'
    or auth.uid() = creator_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "campaigns_seller_insert" on public.campaigns;
create policy "campaigns_seller_insert"
  on public.campaigns for insert
  with check (
    auth.uid() = creator_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('seller', 'admin')
    )
  );

drop policy if exists "campaigns_seller_update" on public.campaigns;
create policy "campaigns_seller_update"
  on public.campaigns for update
  using (
    auth.uid() = creator_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    auth.uid() = creator_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "campaigns_seller_delete" on public.campaigns;
create policy "campaigns_seller_delete"
  on public.campaigns for delete
  using (
    auth.uid() = creator_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Requirements
create table if not exists public.campaign_requirements (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  requirement text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.campaign_requirements enable row level security;

drop policy if exists "campaign_requirements_read" on public.campaign_requirements;
create policy "campaign_requirements_read"
  on public.campaign_requirements for select
  using (true);

drop policy if exists "campaign_requirements_write" on public.campaign_requirements;
create policy "campaign_requirements_write"
  on public.campaign_requirements for all
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  );

-- Resources
create table if not exists public.campaign_resources (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  title text not null,
  url text not null,
  type text not null check (type in ('google_drive', 'dropbox', 'notion', 'zip', 'external')),
  created_at timestamptz not null default now()
);

alter table public.campaign_resources enable row level security;

drop policy if exists "campaign_resources_read" on public.campaign_resources;
create policy "campaign_resources_read"
  on public.campaign_resources for select
  using (true);

drop policy if exists "campaign_resources_write" on public.campaign_resources;
create policy "campaign_resources_write"
  on public.campaign_resources for all
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  );

-- Earnings per platform
create table if not exists public.campaign_earnings (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube_shorts', 'facebook_reels')),
  payout_per_1k numeric(12, 2) not null default 0,
  minimum_payout numeric(12, 2) not null default 0,
  maximum_payout numeric(12, 2) not null default 0,
  unique (campaign_id, platform)
);

alter table public.campaign_earnings enable row level security;

drop policy if exists "campaign_earnings_read" on public.campaign_earnings;
create policy "campaign_earnings_read"
  on public.campaign_earnings for select
  using (true);

drop policy if exists "campaign_earnings_write" on public.campaign_earnings;
create policy "campaign_earnings_write"
  on public.campaign_earnings for all
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  );

-- Joins
create table if not exists public.campaign_joins (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (campaign_id, user_id)
);

alter table public.campaign_joins enable row level security;

drop policy if exists "campaign_joins_read" on public.campaign_joins;
create policy "campaign_joins_read"
  on public.campaign_joins for select
  using (true);

drop policy if exists "campaign_joins_insert_own" on public.campaign_joins;
create policy "campaign_joins_insert_own"
  on public.campaign_joins for insert
  with check (auth.uid() = user_id);

-- Submissions
create table if not exists public.campaign_submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null,
  video_url text not null,
  notes text not null default '',
  views bigint not null default 0,
  earnings numeric(12, 2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaign_submissions enable row level security;

drop policy if exists "campaign_submissions_read" on public.campaign_submissions;
create policy "campaign_submissions_read"
  on public.campaign_submissions for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.creator_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "campaign_submissions_insert_own" on public.campaign_submissions;
create policy "campaign_submissions_insert_own"
  on public.campaign_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "campaign_submissions_update_creator" on public.campaign_submissions;
create policy "campaign_submissions_update_creator"
  on public.campaign_submissions for update
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.creator_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Top performing videos (curated by seller/admin)
create table if not exists public.campaign_top_videos (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  creator_name text not null,
  thumbnail text not null default '',
  video_url text not null,
  views bigint not null default 0,
  earnings numeric(12, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.campaign_top_videos enable row level security;

drop policy if exists "campaign_top_videos_read" on public.campaign_top_videos;
create policy "campaign_top_videos_read"
  on public.campaign_top_videos for select
  using (true);

drop policy if exists "campaign_top_videos_write" on public.campaign_top_videos;
create policy "campaign_top_videos_write"
  on public.campaign_top_videos for all
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id
        and (
          c.creator_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          )
        )
    )
  );

-- Join count helper view
create or replace view public.campaign_join_counts as
select campaign_id, count(*)::int as join_count
from public.campaign_joins
group by campaign_id;

grant select on public.campaign_join_counts to anon, authenticated;

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists campaigns_updated_at on public.campaigns;
create trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.set_updated_at();

drop trigger if exists campaign_submissions_updated_at on public.campaign_submissions;
create trigger campaign_submissions_updated_at
  before update on public.campaign_submissions
  for each row execute function public.set_updated_at();
