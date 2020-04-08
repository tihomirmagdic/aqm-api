update airq.regiontypes
set ${set:raw}
where
  (id) in
    (
      select (c->>'id') from
        (
          select unnest(${where:raw})::json c
        ) x
    )
	${returning:raw}