select * from airq.filteritems
where
  (filter, sensor, min_max) in
    (
      select (c->>'filter')::int4, (c->>'sensor'), (c->>'min_max') from
        (
          select unnest(${where:raw})::json c
        ) x
    )