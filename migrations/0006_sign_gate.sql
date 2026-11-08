insert into site_settings (key, value)
values ('digital_sign', 'on')
on conflict (key) do nothing;
