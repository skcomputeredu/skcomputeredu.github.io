create table if not exists upload_chunk (
  token text not null,
  idx integer not null,
  part text not null,
  primary key (token, idx)
);
