insert into airq.translations
  (${values:name})
  values(${values:csv})
	${returning:raw}