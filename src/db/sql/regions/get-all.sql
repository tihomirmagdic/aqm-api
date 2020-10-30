select 
	id, type, name, gtype, ST_AsGeoJSON(coordinates)::json->>'coordinates' coordinates
from 
	airq.regions