insert into airq.regions
  (${values:name})
  values${colValues:raw}
	${returning:raw}