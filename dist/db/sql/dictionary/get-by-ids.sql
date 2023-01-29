select * from airq.dictionary
where
  (translation, id) in
    (
      select (c->>'translation'), (c->>'id') from
        (
          select unnest(${where:raw})::json c
        ) x
    )