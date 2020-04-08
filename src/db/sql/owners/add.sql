insert into airq.owners
  (${values:name})
  values(${values:csv})
	${returning:raw}