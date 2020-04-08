select 
	id, type, name, gtype, ST_AsText(area) area
from 
	airq.regions
where
  (id) in
    (
      select (c->>'id') from
        (
          select unnest(${where:raw})::json c
        ) x
    )