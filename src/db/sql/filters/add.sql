insert into airq.filters
  (${values:name})
  values(${values:csv})
	${returning:raw}