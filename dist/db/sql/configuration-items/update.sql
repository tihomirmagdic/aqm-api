update airq.configurationitems
set ${set:raw}
where
  (configuration, key) in
    (
      select (c->>'configuration'), (c->>'key') from
        (
          select unnest(${where:raw})::json c
        ) x
    )
	${returning:raw}