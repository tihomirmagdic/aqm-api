insert into airq.filteritems
  (${values:name})
  values(${values:csv})
	${returning:raw}