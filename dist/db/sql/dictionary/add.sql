insert into airq.dictionary
  (${values:name})
  values(${values:csv})
	${returning:raw}