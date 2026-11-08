create table if not exists site_settings (
  key text primary key,
  value text not null
);

insert into site_settings (key, value)
values ('registration_fee', 'off')
on conflict (key) do nothing;
