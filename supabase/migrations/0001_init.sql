create extension if not exists pgcrypto;

create table if not exists questions (
  id text primary key,
  domain text not null,
  type text not null,
  question text not null,
  options jsonb not null,
  answer jsonb not null,
  difficulty text not null,
  explanation text,
  tags text[],
  vector jsonb,
  enabled boolean not null default true,
  source text not null default 'batch',
  created_at timestamptz not null default now(),
  constraint questions_type_check check (type in ('single', 'multiple')),
  constraint questions_difficulty_check check (difficulty in ('easy', 'medium', 'hard'))
);

create table if not exists leaderboard (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  score numeric(6,2) not null,
  correct_count int not null,
  total_count int not null,
  accuracy numeric(6, 4) not null,
  duration_sec int not null,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_questions_enabled_domain on questions (enabled, domain);
create index if not exists idx_leaderboard_rank on leaderboard (accuracy desc, duration_sec asc, submitted_at asc);

alter table questions enable row level security;
alter table leaderboard enable row level security;

create policy "leaderboard_read" on leaderboard for select using (true);
create policy "leaderboard_insert" on leaderboard for insert with check (true);
