-- VibeDeploy schema
-- Run this once in your Supabase SQL editor

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_type text not null,
  subdomain text unique not null,
  deployment_url text,
  status text default 'live',
  config jsonb default '{}',
  notification_email text,
  stats jsonb default '{"views": 0, "submissions": 0}',
  created_at timestamptz default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  data jsonb not null,
  status text default 'new',
  created_at timestamptz default now()
);

-- RLS
alter table projects enable row level security;
alter table submissions enable row level security;

-- Public can insert submissions (form submissions from generated apps)
create policy "anyone can submit" on submissions for insert with check (true);

-- Public can read their own project's submissions via project_id
create policy "public insert projects" on projects for insert with check (true);
create policy "public read projects" on projects for select using (true);

-- Increment view/submission counts
create or replace function increment_stat(project_id uuid, stat_key text)
returns void language plpgsql as $$
begin
  update projects
  set stats = jsonb_set(stats, array[stat_key], (coalesce((stats->>stat_key)::int, 0) + 1)::text::jsonb)
  where id = project_id;
end;
$$;
