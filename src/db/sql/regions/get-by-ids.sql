select 
	id, type, name, gtype, ST_AsGeoJSON(coordinates)::json->>'coordinates' coordinates
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