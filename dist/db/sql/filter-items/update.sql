update airq.filteritems
set ${set:raw}
where
  (filter, sensor, min_max) in
    (
      select (c->>'filter')::int4, (c->>'sensor'), (c->>'min_max') from
        (
          select unnest(${where:raw})::json c
        ) x
    )
	${returning:raw}