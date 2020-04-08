delete from airq.configurationitems
where
  (configuration, key) in
    (
      select (c->>'configuration'), (c->>'key') from
        (
          select unnest(${where:raw})::json c
        ) x
    )