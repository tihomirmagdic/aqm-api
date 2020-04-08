select 
	id, type, name, gtype, ST_AsText(area) area
from 
	airq.regions