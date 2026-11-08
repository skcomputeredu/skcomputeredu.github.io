alter table admissions add column if not exists serial_no integer;

with ranked as (
  select id, row_number() over (order by id) as n
  from admissions
  where deleted_at is null
)
update admissions as saved
set serial_no = ranked.n
from ranked
where saved.id = ranked.id;
