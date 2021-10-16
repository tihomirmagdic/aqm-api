select 
	id, type, name, gtype, (ST_AsGeoJSON(coordinates)::json->>'coordinates')::json coordinates
from 
	airq.regions
order by
	name