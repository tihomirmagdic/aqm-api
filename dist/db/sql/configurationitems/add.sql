insert into airq.configurations
  (${values:name})
  values(${values:csv})
	${returning:raw}