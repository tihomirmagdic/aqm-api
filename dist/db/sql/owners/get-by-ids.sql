select 
  id, email, name, admin, enabled, created
from
  airq.owners
where
  (id) in
    (
      select (c->>'id')::int4 from
        (
          select unnest(${where:raw})::json c
        ) x
    )