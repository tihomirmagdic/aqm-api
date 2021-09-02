select * from airq.filteritems
where
  (filter, sensor) in
    (
      select (c->>'filter')::int4, (c->>'sensor') from
        (
          select unnest(${where:raw})::json c
        ) x
    )