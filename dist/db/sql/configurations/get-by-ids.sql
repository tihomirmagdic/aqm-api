select * from airq.configurations
where
  (id) in
    (
      select (c->>'id') from
        (
          select unnest(${where:raw})::json c
        ) x
    )