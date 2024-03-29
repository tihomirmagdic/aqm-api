select 
	id, type, name, gtype, (ST_AsGeoJSON(coordinates)::json->>'coordinates')::json coordinates
from 
	airq.regions
where
  (id) in
    (
      select (c->>'id')::int4 from
        (
          select unnest(${where:raw})::json c
        ) x
    )