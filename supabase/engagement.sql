-- Run once in the Supabase SQL editor.
create table if not exists reactions (
  post_type text not null check (post_type in ('review','article','blog')),
  slug text not null,
  voter_id text not null,
  value smallint not null check (value in (1,-1)),
  created_at timestamptz not null default now(),
  primary key (post_type, slug, voter_id)
);

create table if not exists comments (
  id bigint generated always as identity primary key,
  post_type text not null check (post_type in ('review','article','blog')),
  slug text not null,
  voter_id text not null,
  name text not null check (char_length(name) between 1 and 40),
  body text not null check (char_length(body) between 2 and 1000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on comments (post_type, slug, status, created_at desc);

-- The site talks to these tables only from the server with the service role key,
-- so lock them down for everyone else.
alter table reactions enable row level security;
alter table comments enable row level security;
