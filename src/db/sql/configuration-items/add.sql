insert into airq.configurationitems
  (${values:name})
  values(${values:csv})
	${returning:raw}