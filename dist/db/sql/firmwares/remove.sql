delete from airq.firmwares
where
  (id) in
    (
      select (c->>'id')::int4 from
        (
          select unnest(${where:raw})::json c
        ) x
    )