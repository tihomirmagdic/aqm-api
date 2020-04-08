insert into airq.regiontypes
  (${values:name})
  values(${values:csv})
	${returning:raw}