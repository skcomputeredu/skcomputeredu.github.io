create table if not exists payments (
  id serial primary key,
  created_at timestamptz not null default now(),
  admission_id integer,
  student_name text not null default '',
  mobile text not null,
  amount text not null,
  method text not null,
  status text not null,
  payee_upi text not null,
  payer_upi text not null default ''
);
