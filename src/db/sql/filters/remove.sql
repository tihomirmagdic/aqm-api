delete from airq.filters
where
  (id) in
    (
      select (c->>'id')::int4 from
        (
          select unnest(${where:raw})::json c
        ) x
    )