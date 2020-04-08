insert into airq.data
  (${values:name})
  values${colValues:raw}
	${returning:raw}