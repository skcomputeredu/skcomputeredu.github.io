create table if not exists admin_secret (
  id integer primary key,
  password_hash text not null
);

create table if not exists admin_session (
  token_hash text primary key,
  expires_at timestamptz not null
);

create table if not exists admissions (
  id serial primary key,
  created_at timestamptz not null default now(),
  student_name text not null,
  mobile text not null,
  course text not null,
  form jsonb not null
);
